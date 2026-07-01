/**
 * Service-to-service communication tokens and configuration
 */
export const SERVICE_NAMES = {
  USERS: 'users-management',
  PAYROLL: 'payroll',
  EXPENSE: 'expense',
  NOTIFICATION: 'notification',
  INVOICE: 'invoice',
  WORKFLOW: 'workflow',
} as const;

export const SERVICE_ENDPOINTS = {
  USERS: '/api/v1/internal',
  PAYROLL: '/api/v1/internal',
  EXPENSE: '/api/v1/internal',
  NOTIFICATION: '/api/v1/internal',
  INVOICE: '/api/v1/internal',
  WORKFLOW: '/api/v1/internal',
} as const;
