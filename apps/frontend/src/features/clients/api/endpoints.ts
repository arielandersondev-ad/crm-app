export const ENDPOINTS = {
  GET: {
    FIND_ALL: '/cliente',
    FIND_BY_TENANT_ID: '/cliente/tenant',
    FIND_BY_ID: '/cliente/:id',
  },
  CREATE: '/cliente/create',
  UPDATE: '/cliente/update/:id',
} as const