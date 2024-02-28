import winston from "winston";
import { Service } from "../../types";

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      let message = `[${info.timestamp}][${
        winstonLogger.defaultMeta.service
      }][${info.level.toUpperCase()}]`;

      if (winstonLogger.defaultMeta.code) {
        message += `[${winstonLogger.defaultMeta.code}]`;
      }

      message += `: ${info.message}`;

      return message;
    })
  ),
  transports: [new winston.transports.Console()],
});

class Logger {
  static info(service: Service, message: string) {
    winstonLogger.defaultMeta = { service: service };
    winstonLogger.info(message);
  }

  static warn(service: Service, message: string) {
    winstonLogger.defaultMeta = { service: service };
    winstonLogger.warn(message);
  }

  static error(service: Service, message: string, code?: number) {
    winstonLogger.defaultMeta = { service: service, code };
    winstonLogger.error(message);
  }
}

export default Logger;
