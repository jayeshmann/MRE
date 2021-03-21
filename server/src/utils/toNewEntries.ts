/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { v4 } from "uuid";
import { HealthCheckRating, Entry, EntriesType, Diagnosis } from "../types";
import { parseString, parseDate, isString, isDate } from "./toNewPatient";
import diagnosisEntries from "../data/diagnoses";

/* const assertNever = (value: never): never => {
  throw new Error(`Unknown Entry Type: ${JSON.stringify(value)}`);
}; */

//Type
const isType = (param: any): param is EntriesType => {
  return Object.values(EntriesType).includes(param);
};

const parseType = (type: any): EntriesType => {
  if (!type || !isString(type) || !isType(type)) {
    throw new Error(`Incorrect or missing type: ${type}`);
  }

  return type;
};
//END

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (healthcheckrating: any): HealthCheckRating => {
  if (healthcheckrating == null || !isHealthCheckRating(healthcheckrating)) {
    throw new Error(
      `Incorrect or missing healthcheckrating: ${healthcheckrating}`
    );
  }

  return healthcheckrating;
};

const parseDiagnosisCodes = (codes: any): Array<Diagnosis["code"]> => {
  if (!codes || !Array.isArray(codes) || !codes.every(isString)) {
    throw new Error(
      `Incorrect or Missing diagnosis codes: ${JSON.stringify(codes)}`
    );
  }

  const diagnosisCodes = diagnosisEntries.map((d) => d.code);
  codes.forEach((code) => {
    if (!diagnosisCodes.includes(code)) {
      throw new Error(`Incorrect diagnosis code: ${code}`);
    }
  });

  return codes;
};

const parseDischarge = (obj: any): { date: string; criteria: string } => {
  if (
    !obj?.date ||
    !obj?.criteria ||
    !isDate(obj.date) ||
    !isString(obj.criteria)
  ) {
    throw new Error("Invalid discharge values");
  }

  return {
    date: parseString(obj.date, "date"),
    criteria: parseString(obj.criteria, "criteria"),
  };
};

const parseSickLeave = (obj: any): { startDate: string; endDate: string } => {
  if (
    !obj?.startDate ||
    !obj?.endDate ||
    !isString(obj.startDate) ||
    !isString(obj.endDate) ||
    !isDate(obj.startDate) ||
    !isDate(obj.endDate)
  ) {
    throw new Error("Invalid sick leave values");
  }

  return {
    startDate: parseString(obj.startDate, "start date"),
    endDate: parseString(obj.endDate, "end date"),
  };
};

export const toNewEntries = (entryObject: any): Entry => {
  const type: EntriesType = parseType(entryObject.type);

  const baseProps = {
    id: v4(),
    description: parseString(entryObject.description, "description"),
    date: parseDate(entryObject.date, "date"),
    specialist: parseString(entryObject.specialist, "specialist"),
    ...(entryObject?.diagnosisCodes
      ? { diagnosisCodes: parseDiagnosisCodes(entryObject?.diagnosisCodes) }
      : {}),
  };

  switch (type) {
    case "Hospital":
      return {
        ...baseProps,
        type: type,
        discharge: parseDischarge(entryObject?.discharge),
      };
    case "OccupationalHealthcare":
      return {
        ...baseProps,
        type: type,
        employerName: parseString(entryObject.employerName, "employer name"),
        ...(entryObject?.sickLeave
          ? { sickLeave: parseSickLeave(entryObject?.sickLeave) }
          : {}),
      };
    case "HealthCheck":
      return {
        ...baseProps,
        type: type,
        healthCheckRating: parseHealthCheckRating(
          entryObject.healthCheckRating
        ),
      };

    default:
      // return assertNever(type);
      throw new Error(`Entry of type ${entryObject.type} is not allowed!`);
  }
};
