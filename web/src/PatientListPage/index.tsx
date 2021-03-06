import React from "react";
import axios from "axios";
import { Container, Table, Button, Input, Icon } from "semantic-ui-react";

import { PatientFormValues } from "../AddPatientModal/AddPatientForm";
import AddPatientModal from "../AddPatientModal";
import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Link } from "react-router-dom";
import { HealthRating } from "./HealthRating";

const PatientListPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const [newSearch, setNewSearch] = React.useState("");

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const handleSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNewSearch(event.target.value);
  };

  const filteredList = Object.values(patients).filter(
    (patient) =>
      patient.name
        .toLocaleLowerCase()
        .includes(newSearch.toLocaleLowerCase()) === true
  );

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients`,
        values
      );
      dispatch({ type: "ADD_PATIENT", payload: newPatient });
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  return (
    <div className="App">
      <Container textAlign="center">
        <h3>
          <Icon name="medrt" color="red"></Icon> Patient List{" "}
          <Icon name="medrt" color="red"></Icon>
        </h3>
        <Input
          icon={{ name: "search", circular: true }}
          placeholder="Search..."
          value={newSearch}
          onChange={handleSearchChange}
        />
      </Container>
      {filteredList.length ? (
        <Table celled color="red">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Icon name="user circle outline" />
                Name
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Icon name="male" />
                Gender
              </Table.HeaderCell>

              <Table.HeaderCell>
                <Icon name="suitcase" />
                Occupation
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Icon name="heartbeat" />
                Health Rating
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.values(filteredList).map((patient: Patient) => {
              const healthRatingPresent = patient.entries.some((entry) => {
                if (entry.type === "HealthCheck") {
                  return true;
                }
                return false;
              });

              return (
                <Table.Row key={patient.id}>
                  <Table.Cell>
                    <Link
                      to={`/patients/${patient.id}`}
                      className={`fancy allsides-${Math.floor(
                        Math.random() * (6 - 1 + 1) + 1
                      )}`}
                    >
                      {patient.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{patient.gender}</Table.Cell>
                  <Table.Cell>{patient.occupation}</Table.Cell>
                  <Table.Cell>
                    {healthRatingPresent ? (
                      <HealthRating entries={patient.entries} />
                    ) : (
                      "Not Available"
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      ) : (
        <h2>No Patients found!</h2>
      )}
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Patient</Button>
    </div>
  );
};

export default PatientListPage;
