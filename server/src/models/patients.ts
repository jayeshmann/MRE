import { model, Schema } from "mongoose";

const patientSchema = new Schema({
  name: String,
  dateOfBirth: String,
  ssn: String,
  gender: String,
  occupation: String,
  entries: Array,
});

patientSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const PatientModel = model("Patient", patientSchema);

export default PatientModel;
