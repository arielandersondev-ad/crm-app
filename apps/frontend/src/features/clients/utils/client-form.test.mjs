import assert from "node:assert/strict";
import test from "node:test";
import { ClientSchema } from "../schemas/client.schema.ts";
import { formatBirthDateForInput, splitClientFormData } from "./client-form.ts";

const patient = {
  fullName: "Paciente de prueba",
  email: "paciente@example.com",
  phone: "70000001",
  birthDate: "1990-06-15",
};

test("editar sin antecedentes conserva la fecha y no envía campos clínicos al paciente", () => {
  const form = ClientSchema.parse({
    ...patient,
    antecedentes: "",
    alergias: "",
    contactoEmergencia: "",
    observaciones: "",
  });
  const { clientData, clinicalData, hasClinicalData } = splitClientFormData(form);
  assert.deepEqual(clientData, patient);
  assert.equal(hasClinicalData, false);
  assert.deepEqual(Object.values(clinicalData), ["", "", "", ""]);
});

test("permite agregar antecedentes posteriormente y enviarlos al perfil clínico", () => {
  const { clientData, clinicalData, hasClinicalData } = splitClientFormData(
    ClientSchema.parse({ ...patient, antecedentes: "Cirugía previa", alergias: "Látex" }),
  );
  assert.deepEqual(clientData, patient);
  assert.equal(hasClinicalData, true);
  assert.equal(clinicalData.antecedentes, "Cirugía previa");
  assert.equal(clinicalData.alergias, "Látex");
});

test("mantiene los campos vacíos para poder borrar antecedentes existentes", () => {
  const { clinicalData } = splitClientFormData(ClientSchema.parse({
    ...patient, antecedentes: "", alergias: "", contactoEmergencia: "", observaciones: "",
  }));
  assert.equal(JSON.stringify(clinicalData), '{"antecedentes":"","alergias":"","contactoEmergencia":"","observaciones":""}');
});

test("la fecha de nacimiento no cambia de día al preparar el formulario", () => {
  assert.equal(formatBirthDateForInput("1990-06-15"), "1990-06-15");
  assert.equal(formatBirthDateForInput("1990-06-15T00:00:00.000Z"), "1990-06-15");
  assert.equal(formatBirthDateForInput(null), "");
  assert.equal(formatBirthDateForInput(undefined), "");
});
