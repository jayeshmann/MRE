/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { NewPatientEntry, Gender } from "../types";
//Name, SSN, Occupation
export const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

export const parseString = (param: any, fieldName: string): string => {
  if (!param || !isString(param)) {
    throw new Error(`Incorrect or missing ${fieldName}: ${param}`);
  }

  return param;
};
//END

//DateOfBirth or Date
export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const parseDate = (date: any, fieldName: string): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing ${fieldName}: ${date}`);
  }
  return date;
};
//END

//Gender
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};
//END

export const toNewPatient = (patientObject: any): NewPatientEntry => {
  return {
    dateOfBirth: parseDate(patientObject.dateOfBirth, "Date of Birth"),
    name: parseString(patientObject.name, "name"),
    occupation: parseString(patientObject.occupation, "occupation"),
    ssn: parseString(patientObject.ssn, "ssn"),
    gender: parseGender(patientObject.gender),
  };
};
