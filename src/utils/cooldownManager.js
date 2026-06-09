<<<<<<< HEAD
/**
 * Advanced cooldown management with automatic cleanup
 */

class CooldownManager {
  constructor() {
    this.cooldowns = new Map();
    this.cleanupInterval = 60000; // 60 seconds
    this.cleanupTimer = null;
    this.startCleanup();
    
    // Clean up on process exit
    process.on("SIGINT", () => this.stopCleanup());
    process.on("SIGTERM", () => this.stopCleanup());
  }

  setCooldown(key, ms) {
    if (typeof key !== "string" || typeof ms !== "number" || ms < 0) {
      return null;
    }
    const expires = Date.now() + ms;
    this.cooldowns.set(key, expires);
    return expires;
  }

  getRemainingTime(key) {
    if (typeof key !== "string") return null;
    
    const expires = this.cooldowns.get(key);
    if (!expires) return null;
    
    const remaining = expires - Date.now();
    if (remaining <= 0) {
      this.cooldowns.delete(key);
      return null;
    }
    return remaining;
  }

  hasCooldown(key) {
    const remaining = this.getRemainingTime(key);
    return remaining !== null && remaining > 0;
  }

  clear(key) {
    if (typeof key === "string") {
      this.cooldowns.delete(key);
    }
  }

  clearAll() {
    this.cooldowns.clear();
  }

  startCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      try {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, expires] of this.cooldowns.entries()) {
          if (expires <= now) {
            this.cooldowns.delete(key);
            cleaned++;
          }
        }
        
        if (cleaned > 0 && process.env.DEBUG === "true") {
          console.log(`[CooldownManager] Cleaned up ${cleaned} expired cooldowns`);
        }
      } catch (error) {
        console.error("[CooldownManager] Cleanup error:", error.message);
      }
    }, this.cleanupInterval);
    
    // Don't keep process alive just for cleanup
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  stopCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  getStats() {
    return {
      totalCooldowns: this.cooldowns.size,
      activeCooldowns: Array.from(this.cooldowns.values()).filter(
        (expires) => expires > Date.now()
      ).length
    };
  }
}

module.exports = new CooldownManager();
=======
/**
 * Advanced cooldown management with automatic cleanup
 */

class CooldownManager {
  constructor() {
    this.cooldowns = new Map();
    this.cleanupInterval = 60000; // 60 seconds
    this.cleanupTimer = null;
    this.startCleanup();
    
    // Clean up on process exit
    process.on("SIGINT", () => this.stopCleanup());
    process.on("SIGTERM", () => this.stopCleanup());
  }

  setCooldown(key, ms) {
    if (typeof key !== "string" || typeof ms !== "number" || ms < 0) {
      return null;
    }
    const expires = Date.now() + ms;
    this.cooldowns.set(key, expires);
    return expires;
  }

  getRemainingTime(key) {
    if (typeof key !== "string") return null;
    
    const expires = this.cooldowns.get(key);
    if (!expires) return null;
    
    const remaining = expires - Date.now();
    if (remaining <= 0) {
      this.cooldowns.delete(key);
      return null;
    }
    return remaining;
  }

  hasCooldown(key) {
    const remaining = this.getRemainingTime(key);
    return remaining !== null && remaining > 0;
  }

  clear(key) {
    if (typeof key === "string") {
      this.cooldowns.delete(key);
    }
  }

  clearAll() {
    this.cooldowns.clear();
  }

  startCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      try {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, expires] of this.cooldowns.entries()) {
          if (expires <= now) {
            this.cooldowns.delete(key);
            cleaned++;
          }
        }
        
        if (cleaned > 0 && process.env.DEBUG === "true") {
          console.log(`[CooldownManager] Cleaned up ${cleaned} expired cooldowns`);
        }
      } catch (error) {
        console.error("[CooldownManager] Cleanup error:", error.message);
      }
    }, this.cleanupInterval);
    
    // Don't keep process alive just for cleanup
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  stopCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  getStats() {
    return {
      totalCooldowns: this.cooldowns.size,
      activeCooldowns: Array.from(this.cooldowns.values()).filter(
        (expires) => expires > Date.now()
      ).length
    };
  }
}

module.exports = new CooldownManager();
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
