export const ENDPOINTS = {
  GET: {
    FIND_ALL_BY_SUCURSAL: '/cita/all',
    GET_AGENDA: '/cita/agenda'
  },
  CREATE: '/cita/create',
  UPDATE: '/cita/update/:id',
  REMOVE: '/cita/delete/:id',
} as const