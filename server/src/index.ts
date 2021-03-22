import cors from "cors";
import express from "express";
require("express-async-errors");
import mongoose from "mongoose";
import middleware from "./middlewares/middleware";
import logger from "./middlewares/logger";
import config from "./middlewares/config";
import diagnoseRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
    logger.error(error.stack);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

app.get("/api/ping", (_req, res) => {
  res.status(200).send("pong");
});
app.use("/api/diagnosis", diagnoseRouter);
app.use("/api/patients", patientRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server serving at ${config.PORT}`);
});
