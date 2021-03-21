import { v4 } from "uuid";
import patientEntries from "../data/patients";
import { Entry, NewPatientEntry, Patient, PublicPatient } from "../types";

const getEntries = (): Patient[] => {
  return patientEntries;
};

const getNonSensitiveEntries = (): PublicPatient[] => {
  return patientEntries.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );
};

const getPatient = (id: string): Patient => {
  const onePatient: Patient | undefined = patientEntries.find(
    (patient) => patient.id === id
  );

  if (!onePatient) {
    throw new Error(`No patient with ID = "${id}" exists.`);
  }
  return { ...onePatient };
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: v4(),
    ...entry,
    entries: [],
  };

  patientEntries.push(newPatientEntry);
  return newPatientEntry;
};

const addEntriesToPatient = (
  toUpdatePatient: Patient,
  newEntries: Entry
): Patient => {
  patientEntries.forEach((patient) => {
    if (patient.id === toUpdatePatient.id) {
      patient.entries.push(newEntries);
    }
  });
  const updatedPatient = patientEntries.find(
    (patient) => patient.id === toUpdatePatient.id
  ) as Patient;
  return { ...updatedPatient };
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  getPatient,
  addEntriesToPatient,
};
