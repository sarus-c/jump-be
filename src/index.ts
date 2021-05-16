import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import config from "./config/config";
import logging from "./config/logging";
import items from "./routes/items";
import search from "./routes/search";


const app: Application = express();
const { port, hostname } = config.server;
const { url, options } = config.mongo;
const NAMESPACE = "SERVER";

/** Connect to MongoDb */
mongoose
  .connect(url, options)
  .then((result) => {
    logging.info(NAMESPACE, "Mongo Connected");
  })
  .catch((error) => {
    logging.error(NAMESPACE, error.message, error);
  });

/** Logging */
app.use((req: Request, res: Response, next: NextFunction) => {
  logging.info(
    NAMESPACE,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    /** Log the res */
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

/** Body parsing Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Rules of our API */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

/** Routes go here */
app.use("/api/items", items);
app.use("/api/search", search);

/** Error handling */
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

const httpServer = http.createServer(app);

httpServer.listen(port, () =>
  logging.info(NAMESPACE, `Server is running ${hostname}:${port}`)
);
