export const ENDPOINTS = {
  GET_TENANT: "/tenant/me",
  UPDATE_TENANT: "/tenant",
  GET_CONFIGURATION: "/configuration",
  UPDATE_CONFIGURATION: "/configuration",
  GET_SUCURSALES: "/sucursal",
  GET_SCHEDULES: (id: string) => `/sucursal/${id}/schedules`,
  UPDATE_SCHEDULES: (id: string) => `/sucursal/${id}/schedules`,
} as const;
