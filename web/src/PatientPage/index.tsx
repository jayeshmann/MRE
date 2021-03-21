import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { Divider, Header, Icon } from "semantic-ui-react";
import AddEntry from "../AddEntryForm";
import { EntryFormValues } from "../AddEntryForm/AddEntryForm";
import EntryDetails from "../components/EntryDetails";
import { apiBaseUrl } from "../constants";
import { singlePatient, useStateValue } from "../state";
import { Patient } from "../types";

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ onePatient }, dispatch] = useStateValue();

  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  const handleCancel = () => {
    setActiveIndex(activeIndex === 0 ? -1 : 0);
  };

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientDataFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(singlePatient(patientDataFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    if (id !== onePatient?.id) {
      fetchPatient();
    }
  }, [dispatch, id]); //eslint-disable-line react-hooks/exhaustive-deps

  if (onePatient === undefined) {
    return <Header as="h3">No Patient with ID="{id}" exists.</Header>;
  }

  const submitNewEntry = async (values: EntryFormValues) => {
    const { data: submittedEntry } = await axios.post<Patient>(
      `${apiBaseUrl}/patients/${id}/entries`,
      values
    );
    dispatch(singlePatient(submittedEntry));
    handleCancel();
  };

  return (
    <div>
      <Header as="h2">
        {onePatient?.name}
        <Icon
          style={{ fontSize: "1em", verticalAlign: "inherit" }}
          name={
            onePatient?.gender !== "other"
              ? onePatient?.gender === "male"
                ? "man"
                : "woman"
              : "genderless"
          }
        />
      </Header>

      <div>
        ssn: {onePatient?.ssn}
        <br />
        occupation: {onePatient?.occupation}
      </div>
      <Divider hidden />
      <div>
        <AddEntry
          onSubmit={submitNewEntry}
          onCancel={handleCancel}
          activeIndex={activeIndex}
        />

        {onePatient?.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
      </div>

      <Divider hidden />
    </div>
  );
};

export default PatientPage;
