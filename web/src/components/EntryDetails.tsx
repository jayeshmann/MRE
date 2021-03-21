import React from "react";
import { Header, Icon, Segment } from "semantic-ui-react";
import { Entry } from "../types";
import { DiagnosisData } from "./DiagnosisData";

interface EntryDetailsProps {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Segment>
          <Header style={{ margin: 0 }} as="h3">
            {entry.date}
            <Icon style={{ marginRight: 0 }} name="hospital outline" />{" "}
          </Header>{" "}
          <em>{entry.description}</em>
          {entry?.diagnosisCodes && (
            <DiagnosisData codes={entry.diagnosisCodes} />
          )}
        </Segment>
      );
    case "OccupationalHealthcare":
      return (
        <Segment>
          <Header style={{ margin: 0 }} as="h3">
            {entry.date} <Icon style={{ marginRight: 0 }} name="stethoscope" />{" "}
            {entry.employerName}
          </Header>{" "}
          <em>{entry.description}</em>
          {entry?.diagnosisCodes && (
            <DiagnosisData codes={entry.diagnosisCodes} />
          )}
        </Segment>
      );
    case "HealthCheck":
      const heartColor = () => {
        switch (entry.healthCheckRating) {
          case 0:
            return "green";
          case 1:
            return "yellow";
          case 2:
            return "orange";
          case 3:
            return "red";
          default:
            return "black";
        }
      };

      return (
        <Segment>
          <Header style={{ margin: 0 }} as="h3">
            {entry.date} <Icon name="user doctor" />
          </Header>{" "}
          <em>{entry.description}</em>
          <br />
          <Icon name="heart" color={heartColor()} />
        </Segment>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
