export const ENDPOINTS = {
  GET_TENANT_USERS: '/users/byTenantId',
  GET_SUCURSAL: '/sucursal',
  CREATE: '/users/assign',
  UPDATE_ROLE_SUCURSAL: '/users/updateRolSucursal',
  UPDATE: '/users/update/:id',
  REMOVE: '/users/delete/:id',
  ACTIVATE: '/users/activate/:id',
  DEACTIVATE: '/users/deactivate/:id',
  CHANGE_PASSWORD: '/users/change-password',
} as const
