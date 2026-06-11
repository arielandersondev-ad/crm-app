export const ENDPOINTS = {
  GET: {
    FIND_ALL: '/visitas/all',
    FIND_ALL_DETAIL_BY_VISIT_ID: 'visit-detail/detail/visitId/:id',
    FIND_ALL_ACTIVE: '/visitas/all/active',
    FIND_ALL_FOR_FORM: '/visitas/all/complete',
  },
  CREATE: '/visitas/create',
  UPDATE: '/visitas/update/:id',
  REMOVE: '/visitas/soft-delete/:id',
  // Visit Detail
  VISIT_DETAIL: {
    UPDATE: '/visit-detail/update/:id',
    CREATE: '/visit-detail/create',
    BULK_CREATE: '/visit-detail/bulk-create',
    REMOVE: '/visit-detail/delete',
  }
}