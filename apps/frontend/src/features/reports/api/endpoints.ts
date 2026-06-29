export const REPORTS_ENDPOINTS = {
  CONSULTATIONS_BY_PERIOD: '/report/consultations-by-period',
  DOCTOR_STATISTICS: '/report/doctor-statistics',
  UPCOMING_CONTROLS: '/report/upcoming-controls',
  CLINICAL_SUMMARY: (consultationId: string) => `/report/clinical-summary/${consultationId}`,
} as const
