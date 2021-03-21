import express from "express";
import middleware from "./middlewares/middleware";
import cors from "cors";
import diagnoseRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";
const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

app.get("/api/ping", (_req, res) => {
  res.status(200).send("pong");
});
app.use("/api/diagnosis", diagnoseRouter);
app.use("/api/patients", patientRouter);

app.use(middleware.unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server serving at ${PORT}`);
});
