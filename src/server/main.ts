import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import apiRouter from "./routers/api";
import webSocketHandler from "./handlers/websocket";
import { errorHandler } from "./handlers/errors";
import logger from "./handlers/logger";
import { Service } from "../types";

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api", apiRouter);

app.get("*", (_request, response) => {
  response.sendFile("/index.html");
});

app.use(errorHandler);

const server = http.createServer(app);

const ws = new WebSocketServer({ server, path: "/websocket" });

webSocketHandler(ws);

server.listen(1212, () => logger.info(Service.Server, "Started"));
ws.once("listening", () => logger.info(Service.WebSocket, "Started"));
