import React, { useEffect, useState } from "react";
import HealthRatingBar from "../components/HealthRatingBar";
import { Patient } from "../types";

interface HealthRatingProps {
  patient: Patient;
}

export const HealthRating: React.FC<HealthRatingProps> = ({ patient }) => {
  const [recentHealthRating, setRecentHealthRating] = useState(0);
  console.log("HealthRating", recentHealthRating);
  useEffect(() => {
    patient.entries.sort((a, b) => {
      return (new Date(a.date) as any) - (new Date(b.date) as any);
    });

    patient.entries.forEach((entry) => {
      if (entry.type === "HealthCheck") {
        setRecentHealthRating(entry.healthCheckRating);
      }
    });
  }, []); //eslint-disable-line

  return <HealthRatingBar showText={true} rating={recentHealthRating} />;
};
