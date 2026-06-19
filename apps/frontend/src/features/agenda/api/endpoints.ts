export const ENDPOINTS = {
  GET: {
    FIND_ALL_BY_SUCURSAL: '/cita/all',
    GET_AGENDA: '/cita/agenda'
  },
  CREATE: '/cita/create',
  UPDATE: '/cliente/update/:id',
  REMOVE: '/cliente/delete/:id',
} as const