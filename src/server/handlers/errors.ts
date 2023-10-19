import { NextFunction, Request, Response } from "express";
import http from "http";
import logger from "./logger";
import { Service } from "../../types";

export class ExpressError extends Error {
  code: number;
  name: string;
  message: string;

  constructor(message?: string, code: keyof typeof http.STATUS_CODES = 500) {
    super();

    this.code = typeof code === "string" ? parseInt(code) : code;

    this.name = http.STATUS_CODES[this.code]!;

    if (message) {
      this.message = message;
    } else {
      this.message = http.STATUS_CODES[this.code]!;
    }
  }
}

export class BadRequestError extends ExpressError {
  constructor(message?: string) {
    super(message, 400);
  }
}

export class NotFoundError extends ExpressError {
  constructor(message?: string) {
    super(message, 404);
  }
}

export class UnauthorizedError extends ExpressError {
  constructor(message?: string) {
    super(message, 401);
  }
}

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof ExpressError) {
    logger.error(Service.Server, error.message, error.code);
    return response.status(error.code).json({ error: error.message });
  }

  logger.error(Service.Server, error.message, 500);
  return response.status(500).json({ error: error.message });
};
