import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ONE_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSIS";
      payload: Diagnosis[];
    };

export const setPatientList = (patientListFromApi: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: patientListFromApi };
};

export const singlePatient = (patientDataFromApi: Patient): Action => {
  return { type: "ONE_PATIENT", payload: patientDataFromApi };
};

export const setDiagnosis = (diagnosisDataFromApi: Diagnosis[]): Action => {
  return { type: "SET_DIAGNOSIS", payload: diagnosisDataFromApi };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "ONE_PATIENT":
      return {
        ...state,
        onePatient: action.payload,
      };
    case "SET_DIAGNOSIS":
      return { ...state, diagnosis: action.payload };
    default:
      return state;
  }
};
