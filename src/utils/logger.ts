import winston from "winston";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import config from "@/config";

const logsDir = path.join(__dirname, "../../logs");
fs.mkdirSync(logsDir, { recursive: true });

const logFilePath = path.join(logsDir, "app.log");

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    http: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    http: "magenta",
    info: "green",
    debug: "blue",
  },
};

winston.addColors(customLevels.colors);

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      message: info.message,
      stack: info.stack,
    });
  }
  return info;
});

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: config.environment === "production" ? "info" : "debug",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `[${timestamp}] ${level}: ${stack || message}`;
        }),
      ),
    }),
    new winston.transports.File({ filename: logFilePath }),
  ],
});

// This is important: use the 'http' level for morgan stream
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export const httpLogger = morgan(
  config.environment === "production" ? "combined" : "dev",
  { stream },
);
