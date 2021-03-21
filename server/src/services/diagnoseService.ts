import diagnoseEntries from "../data/diagnoses";

import { Diagnosis } from "../types";

const getEntries = (): Diagnosis[] => {
  return diagnoseEntries;
};

const addDiagnose = (): [] => {
  return [];
};

export default {
  getEntries,
  addDiagnose,
};
