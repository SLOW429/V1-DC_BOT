<<<<<<< HEAD
/**
 * Structured logging utility for consistent log formatting
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

// Check if colors are supported (disable in non-TTY environments)
const supportsColor = process.stdout.isTTY !== false && process.env.NO_COLOR !== "true";

class Logger {
  log(message, data = null) {
    this._print("INFO", colors.blue, message, data);
  }

  success(message, data = null) {
    this._print("SUCCESS", colors.green, message, data);
  }

  warn(message, data = null) {
    this._print("WARN", colors.yellow, message, data);
  }

  error(message, data = null) {
    this._print("ERROR", colors.red, message, data);
  }

  debug(message, data = null) {
    if (process.env.DEBUG === "true") {
      this._print("DEBUG", colors.cyan, message, data);
    }
  }

  _print(level, color, message, data = null) {
    try {
      const timestamp = new Date().toISOString();
      
      if (supportsColor) {
        const prefix = `${color}${colors.bright}[${timestamp}]${colors.reset} ${color}[${level}]${colors.reset}`;
        console.log(`${prefix} ${message}`);
        if (data) {
          console.log(`${colors.dim}${JSON.stringify(data, null, 2)}${colors.reset}`);
        }
      } else {
        // Fallback for non-TTY environments
        console.log(`[${timestamp}] [${level}] ${message}`);
        if (data) {
          console.log(JSON.stringify(data, null, 2));
        }
      }
    } catch (error) {
      // Fallback if something goes wrong with logging
      console.log(`[${level}] ${message}`, data || "");
    }
  }
}

module.exports = new Logger();
=======
/**
 * Structured logging utility for consistent log formatting
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

// Check if colors are supported (disable in non-TTY environments)
const supportsColor = process.stdout.isTTY !== false && process.env.NO_COLOR !== "true";

class Logger {
  log(message, data = null) {
    this._print("INFO", colors.blue, message, data);
  }

  success(message, data = null) {
    this._print("SUCCESS", colors.green, message, data);
  }

  warn(message, data = null) {
    this._print("WARN", colors.yellow, message, data);
  }

  error(message, data = null) {
    this._print("ERROR", colors.red, message, data);
  }

  debug(message, data = null) {
    if (process.env.DEBUG === "true") {
      this._print("DEBUG", colors.cyan, message, data);
    }
  }

  _print(level, color, message, data = null) {
    try {
      const timestamp = new Date().toISOString();
      
      if (supportsColor) {
        const prefix = `${color}${colors.bright}[${timestamp}]${colors.reset} ${color}[${level}]${colors.reset}`;
        console.log(`${prefix} ${message}`);
        if (data) {
          console.log(`${colors.dim}${JSON.stringify(data, null, 2)}${colors.reset}`);
        }
      } else {
        // Fallback for non-TTY environments
        console.log(`[${timestamp}] [${level}] ${message}`);
        if (data) {
          console.log(JSON.stringify(data, null, 2));
        }
      }
    } catch (error) {
      // Fallback if something goes wrong with logging
      console.log(`[${level}] ${message}`, data || "");
    }
  }
}

module.exports = new Logger();
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
