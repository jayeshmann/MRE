import express from "express";
import diagnoseService from "../services/diagnoseService";

const diagnoseRouter = express.Router();

diagnoseRouter.get("/", (_req, res) => {
  res.send(diagnoseService.getEntries());
});

diagnoseRouter.post("/", (_req, res) => {
  res.send("Saving a diagnose!");
});

export default diagnoseRouter;
