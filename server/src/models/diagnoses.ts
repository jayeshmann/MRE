import { model, Schema } from "mongoose";

const diagnosesSchema = new Schema({
  name: String,
  code: String,
  latin: String,
});

diagnosesSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    // returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const DiagnosesModel = model("Diagnoses", diagnosesSchema);

export default DiagnosesModel;
