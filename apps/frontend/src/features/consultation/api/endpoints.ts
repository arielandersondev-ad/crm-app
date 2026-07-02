export const ENDPOINTS = {
  CREATE: "/consultation",
  UPDATE: "/consultation/:id",
  DELETE: "/consultation/:id",
  GET_ALL: "/consultation/list",
  GET_BY_ID: "/consultation/:id",
  GET_BY_CLIENT: "/consultation/client/:clientId",
  UPSERT_REFRACTION: "/consultation/:id/refraction",
  START_FROM_APPOINTMENT: "/consultation/start-from-appointment/:appointmentId",
} as const;
