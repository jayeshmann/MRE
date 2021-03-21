import React from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Diagnosis } from "../types";
import { setDiagnosis, useStateValue } from "../state";

interface DiagnosisDataProps {
  codes: string[];
}

export const DiagnosisData: React.FC<DiagnosisDataProps> = ({ codes }) => {
  const [{ diagnosis }, dispatch] = useStateValue();
  React.useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const { data: diagnosisDataFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnosis`
        );
        dispatch(setDiagnosis(diagnosisDataFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    if (!diagnosis?.[0]) fetchDiagnosis();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ul>
      {codes.map((code) => (
        <li key={code}>
          {code}{" "}
          {diagnosis?.map((diagnose) => {
            if (diagnose.code === code) {
              return diagnose.name;
            }
          })}
        </li>
      ))}
    </ul>
  );
};
