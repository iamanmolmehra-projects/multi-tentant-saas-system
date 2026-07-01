export enum PermissionEnum {
  // User Management
  USERS_CREATE = 'users:create',
  USERS_READ = 'users:read',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  USERS_LIST = 'users:list',

  // Role Management
  ROLES_CREATE = 'roles:create',
  ROLES_READ = 'roles:read',
  ROLES_UPDATE = 'roles:update',
  ROLES_DELETE = 'roles:delete',

  // Organization Management
  ORG_CREATE = 'org:create',
  ORG_READ = 'org:read',
  ORG_UPDATE = 'org:update',
  ORG_DELETE = 'org:delete',

  // Expense Management
  EXPENSE_CREATE = 'expense:create',
  EXPENSE_READ = 'expense:read',
  EXPENSE_UPDATE = 'expense:update',
  EXPENSE_DELETE = 'expense:delete',
  EXPENSE_APPROVE = 'expense:approve',

  // Payroll Management
  PAYROLL_CREATE = 'payroll:create',
  PAYROLL_READ = 'payroll:read',
  PAYROLL_UPDATE = 'payroll:update',
  PAYROLL_PROCESS = 'payroll:process',

  // Invoice Management
  INVOICE_CREATE = 'invoice:create',
  INVOICE_READ = 'invoice:read',
  INVOICE_UPDATE = 'invoice:update',
  INVOICE_DELETE = 'invoice:delete',
  INVOICE_APPROVE = 'invoice:approve',

  // Workflow Management
  WORKFLOW_CREATE = 'workflow:create',
  WORKFLOW_READ = 'workflow:read',
  WORKFLOW_UPDATE = 'workflow:update',
  WORKFLOW_DELETE = 'workflow:delete',
  WORKFLOW_EXECUTE = 'workflow:execute',

  // Notification Management
  NOTIFICATION_CREATE = 'notification:create',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_UPDATE = 'notification:update',

  // Reporting
  REPORT_VIEW = 'report:view',
  REPORT_GENERATE = 'report:generate',
  REPORT_EXPORT = 'report:export',
}
