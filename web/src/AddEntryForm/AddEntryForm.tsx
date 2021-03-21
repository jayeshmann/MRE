import axios from "axios";
import { Field, Formik, Form } from "formik";
import React from "react";
import { Button, Grid } from "semantic-ui-react";
import {
  DiagnosisSelection,
  NumberField,
  SelectField,
  TextField,
} from "../AddPatientModal/FormField";
import { apiBaseUrl } from "../constants";
import { setDiagnosis, useStateValue } from "../state";
import {
  Diagnosis,
  EntriesType,
  NewHealthCheckEntry,
  NewHospitalEntry,
  NewOccupationalHealthCareEntry,
} from "../types";

export type EntryFormValues =
  | NewHealthCheckEntry
  | NewHospitalEntry
  | NewOccupationalHealthCareEntry;

type InitialValues = {
  type: "HealthCheck" | "Hospital" | "OccupationalHealthcare";
  description: string;
  specialist: string;
  date: string;
  healthCheckRating: number;
  discharge: {
    date: string;
    criteria: string;
  };
  employerName: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
};

interface AddEntryFormProps {
  onSubmit: (values: EntryFormValues) => Promise<void>;
  onCancel: () => void;
}

export type entryTypeOption = {
  label: string;
  value: EntriesType;
};

export const entryTypeOptions: entryTypeOption[] = [
  { value: EntriesType.HealthCheck, label: "Health Check" },
  { value: EntriesType.Hospital, label: "Hospital" },
  {
    value: EntriesType.OccupationalHealthcare,
    label: "Occupational Healthcare",
  },
];

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onSubmit, onCancel }) => {
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
  }, [dispatch]); //eslint-disable-line react-hooks/exhaustive-deps

  const initialValues: InitialValues = {
    type: "HealthCheck",
    description: "",
    specialist: "",
    date: new Date().toISOString().slice(0, 10),
    healthCheckRating: 0,
    discharge: {
      date: new Date().toISOString().split("T")[0],
      criteria: "",
    },
    employerName: "",
    diagnosisCodes: undefined,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, actions) => {
        try {
          await onSubmit(values);
          actions.resetForm();
        } catch (e) {
          console.error(e.response.data);
        }
      }}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: {
          [field: string]: string | { [field: string]: string }; //please ignore this loosely typed errors
        } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        } else if (values.type === "HealthCheck") {
          const healthRating = String(values.healthCheckRating);
          if (healthRating === "" || values.healthCheckRating === undefined) {
            errors.healthCheckRating = requiredError;
          } else if (
            values.healthCheckRating > 3 ||
            values.healthCheckRating < 0
          ) {
            errors.healthCheckRating =
              "Choose Health Check Rating between 0 to 3, 0 being Healthy to 3 being at Critical Risk";
          }
        } else if (values.type === "Hospital") {
          if (!values.discharge.date) {
            errors.discharge = {};
            errors.discharge.date = requiredError;
          }
          if (!values.discharge.criteria) {
            errors.discharge = {};
            errors.discharge.criteria = requiredError;
          }
        } else if (values.type === "OccupationalHealthcare") {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }

          if (!values?.sickLeave?.startDate !== !values?.sickLeave?.endDate) {
            errors.sickLeave = {};
            if (!values?.sickLeave?.startDate) {
              errors.sickLeave.startDate =
                requiredError + " if End Date is mentioned";
            } else {
              errors.sickLeave.endDate =
                requiredError + " if Start Date is mentioned";
            }
          }
        }
        return errors;
      }}
    >
      {({
        values,
        isValid,
        dirty,
        setFieldValue,
        setFieldTouched,
        resetForm,
        isSubmitting,
      }) => {
        return (
          <Form className="form ui">
            <SelectField name="type" label="Type" options={entryTypeOptions} />
            <Field
              label="Date"
              placeholder="Date"
              name="date"
              component={TextField}
              disabled={true}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(
                diagnosis?.[0]
                  ? diagnosis
                  : [
                      {
                        name: "Couldn't get data from server, try again later",
                        code: "000",
                      },
                    ]
              )}
            />
            {String(values.type) === "HealthCheck" ? (
              <Field
                label="Health Check Rating"
                placeholder="Choose between 0 to 3, 0 being Healthy to 3 being at Critical Risk"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
              />
            ) : null}
            {String(values.type) === "Hospital" ? (
              <>
                <Field
                  label="Date of discharge"
                  placeholder="Date of discharge"
                  name="discharge.date"
                  component={TextField}
                />
                <Field
                  label="Criteria of discharge"
                  placeholder="Criteria"
                  name="discharge.criteria"
                  component={TextField}
                />
              </>
            ) : null}
            {String(values.type) === "OccupationalHealthcare" ? (
              <>
                <Field
                  label="Employer Name"
                  placeholder="Employer Name"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="Sick Leave Start"
                  placeholder="Start Date"
                  name="sickLeave.startDate"
                  component={TextField}
                />
                <Field
                  label="Sick Leave End"
                  placeholder="End Date"
                  name="sickLeave.endDate"
                  component={TextField}
                />
              </>
            ) : null}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button
                  loading={isSubmitting}
                  type="submit"
                  positive={true}
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="button"
                  floated="right"
                  onClick={() => {
                    resetForm();
                    return onCancel();
                  }}
                  negative={true}
                >
                  Cancel
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};
export default AddEntryForm;
