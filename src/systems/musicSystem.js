const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  entersState
} = require("@discordjs/voice");
const { ChannelType, PermissionFlagsBits } = require("discord.js");
const playdl = require("play-dl");
const db = require("../database/db");
const config = require("../config");
const logger = require("../utils/logger");

playdl.getFreeClientID().catch(() => null);

const queues = new Map();
let nextTrackIdCounter = 0;

function getQueue(guildId) {
  return queues.get(guildId);
}

function nextTrackId() {
  nextTrackIdCounter += 1;
  return nextTrackIdCounter;
}

function loadQueueFromDatabase(guildId) {
  try {
    return db
      .prepare("SELECT url, title, requested_by AS requestedBy, position FROM music_queue WHERE guild_id = ? ORDER BY position ASC")
      .all(guildId);
  } catch (error) {
    logger.error("Failed to load saved music queue", { error: error.message, guildId });
    return [];
  }
}

function persistQueueState(guildId) {
  const queue = getQueue(guildId);
  if (!queue) return;

  try {
    const now = Date.now();
    const deleteStmt = db.prepare("DELETE FROM music_queue WHERE guild_id = ?");
    const insertStmt = db.prepare(
      "INSERT INTO music_queue (guild_id, url, title, requested_by, position, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    );

    db.transaction(() => {
      deleteStmt.run(guildId);
      queue.songs.forEach((song, index) => {
        insertStmt.run(guildId, song.url, song.title, song.requestedBy || "unknown", index + 1, now);
      });
    })();
  } catch (error) {
    logger.error("Failed to persist music queue", { error: error.message, guildId });
  }
}

function clearSavedQueue(guildId) {
  try {
    db.prepare("DELETE FROM music_queue WHERE guild_id = ?").run(guildId);
  } catch (error) {
    logger.error("Failed to clear saved music queue", { error: error.message, guildId });
  }
}

function startIdleTimer(queue) {
  if (!queue || queue.destroying || queue.idleTimer) return;
  queue.idleTimer = setTimeout(() => {
    logger.log("Music idle timeout reached; disconnecting", { guildId: queue.guildId });
    stop(queue.guildId);
  }, config.music.autoDisconnectMs);
}

function clearIdleTimer(queue) {
  if (queue?.idleTimer) {
    clearTimeout(queue.idleTimer);
    queue.idleTimer = null;
  }
}

function destroyStream(streamResult) {
  if (!streamResult) return;
  try {
    streamResult.stream?.destroy?.();
  } catch (error) {
    logger.warn("Failed to destroy audio stream", { error: error.message });
  }
}

function destroyActiveStream(queue) {
  if (!queue?.activeStream) return;
  try {
    queue.activeStream.destroy?.();
  } catch (error) {
    logger.warn("Failed to destroy active stream", { error: error.message, guildId: queue.guildId });
  }
  queue.activeStream = null;
}

function isPlaybackValid(queue, trackId, generation) {
  return (
    queue &&
    !queue.destroying &&
    !queue.stopRequested &&
    queue.currentTrackId === trackId &&
    queue.playbackGeneration === generation
  );
}

function addPlayerListener(queue, event, handler) {
  queue.player.on(event, handler);
  queue.playerListeners.push({ event, handler });
}

function removePlayerListeners(queue) {
  if (!queue?.playerListeners?.length) return;
  for (const { event, handler } of queue.playerListeners) {
    queue.player.removeListener(event, handler);
  }
  queue.playerListeners = [];
}

function removeConnectionListeners(queue) {
  if (!queue?.connectionListeners?.length || !queue.connection) return;
  for (const { event, handler } of queue.connectionListeners) {
    queue.connection.removeListener(event, handler);
  }
  queue.connectionListeners = [];
}

async function handlePlayerIdle(queue, guildId) {
  if (!queue || queue.destroying) return;

  if (queue.stopRequested) {
    queue.stopRequested = false;
    queue.currentTrack = null;
    queue.currentTrackId = 0;
    return;
  }

  if (queue.clearRequested) {
    queue.clearRequested = false;
    queue.currentTrack = null;
    queue.currentTrackId = 0;
    queue.playing = false;
    startIdleTimer(queue);
    return;
  }

  if (queue.skipRequested) {
    queue.skipRequested = false;
    queue.currentTrack = null;
    queue.currentTrackId = 0;
    persistQueueState(guildId);

    if (queue.songs.length > 0) {
      await playSong(guildId);
      return;
    }

    queue.playing = false;
    startIdleTimer(queue);
    return;
  }

  if (queue.songs.length > 0) {
    queue.songs.shift();
  }
  queue.currentTrack = null;
  queue.currentTrackId = 0;
  persistQueueState(guildId);

  if (queue.songs.length > 0) {
    await playSong(guildId);
    return;
  }

  queue.playing = false;
  startIdleTimer(queue);
}

function createQueue(guildId) {
  const player = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Play }
  });

  const queue = {
    guildId,
    connection: null,
    player,
    songs: [],
    playing: false,
    textChannel: null,
    voiceChannel: null,
    idleTimer: null,
    currentTrack: null,
    currentTrackId: 0,
    playbackGeneration: 0,
    skipRequested: false,
    stopRequested: false,
    clearRequested: false,
    destroying: false,
    activeStream: null,
    playerListeners: [],
    connectionListeners: []
  };

  addPlayerListener(queue, AudioPlayerStatus.Idle, () => {
    void handlePlayerIdle(queue, guildId).catch((error) => {
      logger.error("Idle handler failed", { error: error.message, guildId });
    });
  });

  addPlayerListener(queue, AudioPlayerStatus.Playing, () => {
    if (queue.destroying) return;
    queue.playing = true;
    clearIdleTimer(queue);
  });

  addPlayerListener(queue, "error", (error) => {
    if (queue.destroying || queue.stopRequested || queue.skipRequested || queue.clearRequested) return;
    logger.error("Audio player error", { error: error.message, guildId });
  });

  queues.set(guildId, queue);
  return queue;
}

async function createConnection(queue, voiceChannel) {
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    selfDeaf: true
  });

  const onDisconnected = async () => {
    if (queue.destroying) return;
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5000)
      ]);
    } catch (error) {
      logger.warn("Music voice connection disconnected", {
        guildId: voiceChannel.guild.id,
        channelId: voiceChannel.id,
        error: error.message
      });
    }
  };

  connection.on(VoiceConnectionStatus.Disconnected, onDisconnected);
  queue.connectionListeners.push({ event: VoiceConnectionStatus.Disconnected, handler: onDisconnected });

  await entersState(connection, VoiceConnectionStatus.Ready, 20000);
  return connection;
}

async function ensureConnection(queue, voiceChannel) {
  if (!queue) throw new Error("Queue is not available");
  if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
    throw new Error("A guild voice channel is required");
  }

  queue.voiceChannel = voiceChannel;

  if (
    !queue.connection ||
    queue.connection.state.status === VoiceConnectionStatus.Destroyed ||
    queue.connection.joinConfig.channelId !== voiceChannel.id
  ) {
    if (queue.connection && queue.connection.state.status !== VoiceConnectionStatus.Destroyed) {
      removeConnectionListeners(queue);
      queue.connection.destroy();
    }
    queue.connection = await createConnection(queue, voiceChannel);
    queue.connection.subscribe(queue.player);
  }

  return queue.connection;
}

function validateMusicControl(guild, member, botMember, options = {}) {
  const { requireBotInVoice = true, voiceChannel = null } = options;

  if (!member?.voice?.channel) {
    return { ok: false, code: "not_in_voice" };
  }

  const targetChannel = voiceChannel || member.voice.channel;

  if (member.voice.channel.id !== targetChannel.id) {
    return { ok: false, code: "different_channel" };
  }

  if (requireBotInVoice) {
    const botVoiceChannel = botMember?.voice?.channel;
    if (!botVoiceChannel) {
      return { ok: false, code: "bot_not_in_voice" };
    }
    if (member.voice.channel.id !== botVoiceChannel.id) {
      return { ok: false, code: "different_channel" };
    }
  }

  const me = botMember || guild?.members?.me;
  const permissions = targetChannel.permissionsFor(me);
  if (!permissions?.has(PermissionFlagsBits.Connect)) {
    return { ok: false, code: "no_connect" };
  }
  if (!permissions?.has(PermissionFlagsBits.Speak)) {
    return { ok: false, code: "no_speak" };
  }

  return { ok: true };
}

async function searchSong(query) {
  const input = String(query || "").trim();
  if (!input) return null;

  try {
    const validation = playdl.yt_validate(input);
    if (validation === "video") {
      const video = await playdl.video_basic_info(input);
      return { title: video.video_details.title, url: video.video_details.url };
    }

    const results = await playdl.search(input, { limit: 1, source: { youtube: "video" } });
    if (!results.length) return null;
    return { title: results[0].title, url: results[0].url };
  } catch (error) {
    logger.error("Failed to search song", { error: error.message, query: input });
    return null;
  }
}

async function playSong(guildId) {
  const queue = getQueue(guildId);
  if (!queue || queue.destroying || queue.stopRequested) return false;

  if (queue.songs.length === 0) {
    queue.playing = false;
    queue.currentTrack = null;
    queue.currentTrackId = 0;
    startIdleTimer(queue);
    return false;
  }

  const song = queue.songs[0];
  const trackId = nextTrackId();
  const generation = queue.playbackGeneration;

  queue.currentTrack = song;
  queue.currentTrackId = trackId;

  try {
    await ensureConnection(queue, queue.voiceChannel);

    if (!isPlaybackValid(queue, trackId, generation)) {
      return false;
    }

    const streamResult = await playdl.stream(song.url);

    if (!isPlaybackValid(queue, trackId, generation)) {
      destroyStream(streamResult);
      return false;
    }

    destroyActiveStream(queue);
    queue.activeStream = streamResult.stream;
    const resource = createAudioResource(streamResult.stream, { inputType: streamResult.type });
    queue.connection.subscribe(queue.player);
    queue.player.play(resource);
    queue.playing = true;
    clearIdleTimer(queue);
    return true;
  } catch (error) {
    logger.error("Failed to play song", { error: error.message, guildId, song });

    if (!queue || queue.destroying || queue.stopRequested) {
      return false;
    }

    if (queue.songs.length > 0 && queue.songs[0]?.url === song.url) {
      queue.songs.shift();
      persistQueueState(guildId);
    }

    queue.currentTrack = null;
    queue.currentTrackId = 0;

    if (queue.songs.length > 0 && !queue.skipRequested && !queue.clearRequested) {
      return playSong(guildId);
    }

    queue.playing = false;
    startIdleTimer(queue);
    return false;
  }
}

async function play(guild, voiceChannel, textChannel, songInfo) {
  let queue = getQueue(guild.id);
  if (!queue) {
    queue = createQueue(guild.id);
    queue.songs = loadQueueFromDatabase(guild.id);
  }

  queue.textChannel = textChannel;
  await ensureConnection(queue, voiceChannel);
  queue.songs.push(songInfo);
  persistQueueState(guild.id);

  if (!queue.playing || queue.player.state.status === AudioPlayerStatus.Idle) {
    await playSong(guild.id);
  }

  return queue;
}

function skip(guildId) {
  const queue = getQueue(guildId);
  if (!queue || queue.songs.length === 0) return false;

  queue.playbackGeneration += 1;
  destroyActiveStream(queue);
  queue.skipRequested = true;

  if (queue.songs.length > 0) {
    queue.songs.shift();
  }

  queue.currentTrack = null;
  queue.currentTrackId = 0;
  persistQueueState(guildId);
  queue.player.stop(true);
  return true;
}

function stop(guildId) {
  const queue = getQueue(guildId);
  if (!queue) {
    clearSavedQueue(guildId);
    return false;
  }

  queue.destroying = true;
  queue.stopRequested = true;
  queue.playbackGeneration += 1;
  destroyActiveStream(queue);
  clearIdleTimer(queue);
  queue.songs = [];
  queue.currentTrack = null;
  queue.currentTrackId = 0;
  queue.playing = false;
  queue.player.stop(true);
  clearSavedQueue(guildId);

  removePlayerListeners(queue);

  if (queue.connection && queue.connection.state.status !== VoiceConnectionStatus.Destroyed) {
    removeConnectionListeners(queue);
    queue.connection.destroy();
  }

  queue.connection = null;
  queues.delete(guildId);
  return true;
}

function pause(guildId) {
  const queue = getQueue(guildId);
  if (!queue || queue.songs.length === 0) return false;
  return queue.player.pause(true);
}

function resume(guildId) {
  const queue = getQueue(guildId);
  if (!queue || queue.songs.length === 0) return false;
  return queue.player.unpause();
}

function remove(guildId, position) {
  const queue = getQueue(guildId);
  const index = Number(position) - 1;
  if (!queue || !Number.isInteger(index) || index < 0 || index >= queue.songs.length) return null;

  const [removed] = queue.songs.splice(index, 1);
  persistQueueState(guildId);

  if (index === 0) {
    queue.playbackGeneration += 1;
    destroyActiveStream(queue);
    queue.skipRequested = true;
    queue.currentTrack = null;
    queue.currentTrackId = 0;
    queue.player.stop(true);
  }

  return removed;
}

function shuffle(guildId) {
  const queue = getQueue(guildId);
  if (!queue || queue.songs.length <= 2) return false;

  const current = queue.songs.shift();
  for (let index = queue.songs.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [queue.songs[index], queue.songs[swapIndex]] = [queue.songs[swapIndex], queue.songs[index]];
  }
  queue.songs.unshift(current);
  persistQueueState(guildId);
  return true;
}

function clear(guildId) {
  const queue = getQueue(guildId);
  if (!queue) {
    clearSavedQueue(guildId);
    return false;
  }

  if (queue.songs.length > 1) {
    queue.songs = [queue.songs[0]];
    persistQueueState(guildId);
    return true;
  }

  queue.playbackGeneration += 1;
  destroyActiveStream(queue);
  queue.clearRequested = true;
  queue.songs = [];
  queue.currentTrack = null;
  queue.currentTrackId = 0;
  persistQueueState(guildId);
  clearSavedQueue(guildId);
  queue.player.stop(true);
  return true;
}

function getQueueList(guildId) {
  const queue = getQueue(guildId);
  if (queue) return [...queue.songs];
  return loadQueueFromDatabase(guildId);
}

function nowPlaying(guildId) {
  const queue = getQueue(guildId);
  if (!queue) return null;
  return queue.currentTrack || (queue.songs.length > 0 ? queue.songs[0] : null);
}

async function autoJoinConfiguredVoice(client) {
  try {
    const channelId = config.music.voiceChannelId;
    if (!channelId) return false;

    let channel = client.channels.cache.get(channelId);
    if (!channel) {
      channel = await client.channels.fetch(channelId).catch(() => null);
    }

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      logger.warn("Configured music voice channel is unavailable", { channelId });
      return false;
    }

    let queue = getQueue(channel.guild.id);
    if (!queue) {
      queue = createQueue(channel.guild.id);
      queue.songs = loadQueueFromDatabase(channel.guild.id);
    }

    await ensureConnection(queue, channel);
    logger.log("Voice auto join completed", { guildId: channel.guild.id, channelId: channel.id });

    if (queue.songs.length > 0 && !queue.playing) {
      await playSong(channel.guild.id);
      logger.log("Music queue restored", { guildId: channel.guild.id, tracks: queue.songs.length });
    }

    return true;
  } catch (error) {
    logger.warn("Voice auto join failed", { error: error.message });
    return false;
  }
}

function handleVoiceStateUpdate(oldState, newState) {
  const guildId = oldState.guild?.id || newState.guild?.id;
  if (!guildId) return;

  const queue = getQueue(guildId);
  if (!queue || queue.destroying) return;

  const botId = oldState.client?.user?.id || newState.client?.user?.id;
  if (botId && oldState.member?.id === botId && oldState.channelId && !newState.channelId) {
    stop(guildId);
    return;
  }

  const voiceChannel = queue.voiceChannel;
  if (!voiceChannel) return;
  if (voiceChannel.id !== oldState.channelId && voiceChannel.id !== newState.channelId) return;

  const humans = voiceChannel.members.filter((member) => !member.user.bot).size;
  if (humans === 0) {
    startIdleTimer(queue);
  } else {
    clearIdleTimer(queue);
  }
}

function destroyAll() {
  for (const guildId of [...queues.keys()]) {
    stop(guildId);
  }
}

module.exports = {
  play,
  skip,
  stop,
  pause,
  resume,
  remove,
  shuffle,
  clear,
  getQueueList,
  nowPlaying,
  searchSong,
  validateMusicControl,
  autoJoinConfiguredVoice,
  handleVoiceStateUpdate,
  destroyAll
};
