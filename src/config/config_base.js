const config = require("../config/config");
const winston = require("winston");
const { createLogger, transports, format } = winston;

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http:4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warn: "yellow",
    info: "blue",
    http:"green",
    debug: "white",
  },
};

const devLogger = createLogger({
  levels: customLevels.levels,
  transports: [
    new transports.Console({
        level:"http",
      format: format.combine(
        format.colorize({ colors: customLevels.colors }),
        format.simple(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
  ],
});

const prodLogger = createLogger({
    levels: customLevels.levels,
  transports: [
    new transports.File({level:"info", filename: "./src/errors.log", level: "http" }),
  ],
});

const addLogger = (req, res, next) => {
  if (config.environment === "production") {
    req.logger =prodLogger
   
  } else {
    req.logger = devLogger;
  }

  next();
};

module.exports = addLogger;
