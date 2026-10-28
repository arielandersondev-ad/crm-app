import type { ClientFormData } from "../schemas/client.schema";

// La fecha de nacimiento es una fecha de calendario, sin conversión horaria.
export function formatBirthDateForInput(value: string | null | undefined): string {
  return value?.match(/^\d{4}-\d{2}-\d{2}(?=$|T)/)?.[0] ?? "";
}

export function splitClientFormData(data: ClientFormData) {
  const { antecedentes, alergias, contactoEmergencia, observaciones, ...clientData } = data;
  const clinicalData = { antecedentes, alergias, contactoEmergencia, observaciones };

  return {
    clientData,
    clinicalData,
    hasClinicalData: Object.values(clinicalData).some((value) => !!value?.trim()),
  };
}
