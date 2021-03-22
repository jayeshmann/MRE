import express from "express";
import PatientModel from "../models/patients";
import { PublicPatient } from "../types";
import { toNewEntries, toNewPatient } from "../utils/index";

const patientRouter = express.Router();

patientRouter.get("/all", async (_req, res) => {
  const allPatients = await PatientModel.find({});
  res.status(200).json(allPatients);
});

patientRouter.get("/", async (_req, res) => {
  const allPatients = await PatientModel.find({});
  const result = allPatients.map(
    ({ id, name, occupation, gender, dateOfBirth, entries }: PublicPatient) => {
      return { id, name, occupation, gender, dateOfBirth, entries };
    }
  );
  // res.status(200).json(patientService.getNonSensitiveEntries());
  res.status(200).json(result);
});
patientRouter.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // const singlePatient = patientService.getPatient(id);
    const patientFound = await PatientModel.findById(id);
    res.status(200).json(patientFound);
  } catch (e: unknown) {
    if (e instanceof Error) res.status(400).send(e.message);
  }
});

patientRouter.post("/", async (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    // const addedPatient = patientService.addPatient(newPatient);

    const newPatientDB = new PatientModel({
      ...newPatient,
      entries: [],
    });
    const addedPatientDB = await newPatientDB.save();
    res.json(addedPatientDB);
  } catch (e: unknown) {
    if (e instanceof Error) res.status(400).send(e.message);
  }
});

patientRouter.post("/:id/entries", async (req, res) => {
  const id = req.params.id;

  try {
    const newEntry = toNewEntries(req.body);
    const patientFound = await PatientModel.findById(id);
    // const singlePatient = patientService.getPatient(id);
    /* if (!singlePatient) {
      res.status(400).send({ error: `No Patient with ID="${id}" found.` });
    } */
    const existingEntries = patientFound.entries;

    const newEntries = {
      entries: existingEntries.concat(newEntry),
    };
    /* const updatedPatient = patientService.addEntriesToPatient(
      patientFound,
      newEntry
    ); */

    const result = await PatientModel.findByIdAndUpdate(id, newEntries, {
      new: true,
    });

    res.json(result);
  } catch (e: unknown) {
    if (e instanceof Error) res.status(400).send(e.message);
  }
});

export default patientRouter;
