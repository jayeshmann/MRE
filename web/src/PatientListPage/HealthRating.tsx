import React, { useEffect, useState } from "react";
import HealthRatingBar from "../components/HealthRatingBar";
import { Entry } from "../types";

interface HealthRatingProps {
  entries: Entry[];
}

export const HealthRating: React.FC<HealthRatingProps> = ({ entries }) => {
  const [recentHealthRating, setRecentHealthRating] = useState(0);
  useEffect(() => {
    entries.sort((a, b) => {
      return (new Date(a.date) as any) - (new Date(b.date) as any);
    });

    entries.forEach((entry) => {
      if (entry.type === "HealthCheck") {
        setRecentHealthRating(entry.healthCheckRating);
      }
    });
  }, [entries]);

  return <HealthRatingBar showText={true} rating={recentHealthRating} />;
};
