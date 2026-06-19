export const ENDPOINTS = {
  GET: {
    FIND_ALL: '/cliente',
    FIND_BY_TENANT_ID: '/cliente/activo/tenant',
    FIND_BY_ID: '/cliente/:id',
  },
  CREATE: '/cliente/create',
  UPDATE: '/cliente/update/:id',
  REMOVE: '/cliente/delete/:id',
} as const