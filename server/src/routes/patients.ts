import express from "express";
import patientService from "../services/patientService";
import { toNewEntries, toNewPatient } from "../utils/index";

const patientRouter = express.Router();

patientRouter.get("/", (_req, res) => {
  res.status(200).json(patientService.getNonSensitiveEntries());
});

patientRouter.get("/:id", (req, res) => {
  const id = req.params.id;

  try {
    const singlePatient = patientService.getPatient(id);
    res.status(200).json(singlePatient);
  } catch (e: unknown) {
    if (e instanceof Error) res.status(400).send(e.message);
  }
});

patientRouter.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);

    res.json(addedPatient);
  } catch (e: unknown) {
    if (e instanceof Error) res.status(400).send(e.message);
  }
});

patientRouter.post("/:id/entries", (req, res) => {
  const id = req.params.id;

  try {
    const newEntry = toNewEntries(req.body);
    const singlePatient = patientService.getPatient(id);
    /* if (!singlePatient) {
      res.status(400).send({ error: `No Patient with ID="${id}" found.` });
    } */
    const updatedPatient = patientService.addEntriesToPatient(
      singlePatient,
      newEntry
    );

    res.json(updatedPatient);
  } catch (e: unknown) {
    if (e instanceof Error) res.status(400).send(e.message);
  }
});

export default patientRouter;
