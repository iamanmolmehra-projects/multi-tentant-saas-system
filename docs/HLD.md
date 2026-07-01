# Multi-Tenant SaaS Platform — High-Level Design (HLD)

## Platform Overview

A multi-tenant microservices-based SaaS platform built with NestJS, supporting thousands of tenants, millions of users, and high-throughput enterprise access patterns.

### Monorepo Structure

```
multi-tenant-saas-system/
├── shared/                          → Shared library (guards, decorators, DTOs, constants)
├── services/
│   ├── users-management/            → Port 3001
│   ├── expense-management/          → Port 3002
│   ├── payroll/                     → Port 3003
│   ├── workflow/                    → Port 3004
│   ├── invoice-management/          → Port 3005
│   ├── notification/                → Port 3006
│   └── reporting/                   → Port 3007
├── gateway/                         → API Gateway (Port 3000)
└── docs/                            → Architecture documentation
```

### Per-Service Internal Structure

```
<service-name>/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   ├── dto/
│   │   ├── constants/
│   │   └── utils/
│   ├── core/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   ├── data-source.ts
│   │   │   └── typeorm-config.service.ts
│   │   ├── config/
│   │   └── logger/
│   ├── modules/
│   │   └── <feature-modules>/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## SERVICE 1: USER MANAGEMENT

### 1. Requirements Analysis

**Functional Requirements:**
- Multi-tenant organization CRUD with hierarchy (parent/child orgs)
- User registration, authentication (JWT + refresh tokens), password management
- Role-based access control (RBAC) with dynamic role/permission assignment
- Organization hierarchy with reporting structure (user.parent_id)
- Fine-grained permission management (module:action pattern)
- User profile management, activation/deactivation
- Service-to-service token validation endpoint (internal API)
- Audit logging for all state-changing operations

**Non-Functional Requirements:**
- Auth token validation: < 5ms (cached)
- Login/signup: < 200ms p99
- Supports 10K+ concurrent auth requests
- Strong consistency for user creation (unique email per org)
- High availability (auth is critical path for all services)

**Key Assumptions:**
- Email uniqueness is scoped per organization (same person can exist in multiple orgs)
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens carry permissions in payload to avoid DB lookup on every request
- Refresh tokens stored server-side for revocation capability

### 2. Module Breakdown

| Module | Responsibility |
|--------|---------------|
| `auth` | Login, signup, token refresh, password reset, JWT strategy |
| `users` | User CRUD, profile management, hierarchy queries |
| `organizations` | Org CRUD, hierarchy, settings, tenant provisioning |
| `roles` | Role CRUD, permission assignment, system vs org-specific roles |
| `permissions` | Permission registry, module-action enumeration |
| `audit` | Audit log persistence, query by entity/user/org |
| `health` | Service health endpoint |
| `internal` | Service-to-service endpoints (validate token, resolve user) |

### 3. Database Schema

```sql
-- TABLE: organizations
CREATE TABLE organizations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,        -- INDEX: unique
  parent_id     UUID REFERENCES organizations(id) ON DELETE SET NULL,  -- INDEX
  is_active     BOOLEAN DEFAULT true,
  settings      JSONB DEFAULT '{}',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_ORG_SLUG (unique), IDX_ORG_PARENT_ID

-- TABLE: permissions
CREATE TABLE permissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL UNIQUE,         -- e.g. "expense:create"
  description   VARCHAR(500),
  module        VARCHAR(100) NOT NULL,                -- INDEX
  action        VARCHAR(50) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_PERMISSION_MODULE_ACTION (module, action)

-- TABLE: roles
CREATE TABLE roles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  description   VARCHAR(500),
  org_id        UUID REFERENCES organizations(id) ON DELETE CASCADE,  -- NULL = system role
  is_system     BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_ROLE_ORG_NAME (org_id, name) UNIQUE

-- TABLE: role_permissions (N:N junction)
CREATE TABLE role_permissions (
  role_id       UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- TABLE: users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL,
  password      VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(20),
  org_id        UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  parent_id     UUID REFERENCES users(id) ON DELETE SET NULL,  -- reporting manager
  is_active     BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  version       INT DEFAULT 1,                        -- optimistic locking
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_USER_ORG_EMAIL (org_id, email) UNIQUE, IDX_USER_ORG_ID, IDX_USER_PARENT_ID

-- TABLE: refresh_tokens
CREATE TABLE refresh_tokens (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    VARCHAR(255) NOT NULL,                -- INDEX
  expires_at    TIMESTAMP NOT NULL,
  revoked       BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_REFRESH_TOKEN_HASH, IDX_REFRESH_USER_ID

-- TABLE: audit_logs
CREATE TABLE audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  user_id       UUID,                                 -- INDEX
  action        VARCHAR(100) NOT NULL,
  entity_type   VARCHAR(100) NOT NULL,
  entity_id     VARCHAR(255),
  changes       JSONB,
  ip_address    VARCHAR(45),
  user_agent    TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_AUDIT_ORG_ID, IDX_AUDIT_USER_ID, IDX_AUDIT_ENTITY, IDX_AUDIT_CREATED_AT
```

**Relationships:**
- organizations → organizations (self-referencing 1:N, parent/child)
- users → organizations (N:1)
- users → roles (N:1)
- users → users (self-referencing 1:N, reporting hierarchy)
- roles → permissions (N:N via role_permissions)
- roles → organizations (N:1, nullable for system roles)

**Cross-Service References:**
- Other services reference `user_id` and `org_id` as UUID columns (no FK constraint across DBs)
- Resolved via REST call to `GET /api/v1/internal/users/:id` or cached JWT payload

### 4. Architecture Decision

**Why separate:** Authentication/authorization is the most critical horizontal concern. Every request to every service flows through auth validation. Isolating it allows independent scaling (auth traffic >> business traffic), independent deployment, and security hardening without coupling to business logic.

**Communication:**
- Other services → User Management: **Sync REST** for token validation, user resolution
- User Management → Notification: **Async (SQS/Kafka)** for welcome emails, password reset emails
- Internal endpoints protected by `x-service-api-key` header

### 5. API Design + Repository Layer

**Public Endpoints:**
| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/v1/auth/login | Authenticate user, return JWT |
| POST | /api/v1/auth/signup | Register new user |
| POST | /api/v1/auth/refresh | Refresh access token |
| POST | /api/v1/auth/forgot-password | Initiate password reset |
| POST | /api/v1/auth/reset-password | Complete password reset |
| GET | /api/v1/users | List users in org (paginated) |
| GET | /api/v1/users/:id | Get user by ID |
| POST | /api/v1/users | Create user (admin) |
| PATCH | /api/v1/users/:id | Update user |
| DELETE | /api/v1/users/:id | Deactivate user |
| GET | /api/v1/users/:id/subordinates | Get reporting tree |
| GET | /api/v1/roles | List roles for org |
| POST | /api/v1/roles | Create role |
| PATCH | /api/v1/roles/:id | Update role + permissions |
| DELETE | /api/v1/roles/:id | Delete role |
| GET | /api/v1/permissions | List all permissions |
| POST | /api/v1/organizations | Create org (super admin) |
| GET | /api/v1/organizations/:id | Get org details |
| PATCH | /api/v1/organizations/:id | Update org |
| GET | /api/v1/organizations/:id/children | Get child orgs |

**Internal Endpoints (service-to-service):**
| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/v1/internal/validate-token | Validate JWT, return user context |
| GET | /api/v1/internal/users/:id | Get user by ID (no tenant guard) |
| GET | /api/v1/internal/users/by-org/:orgId | List users in org |

**Repository Interface (UserRepository):**
```typescript
abstract class UserRepository {
  abstract create(data: Partial<UserEntity>): Promise<UserEntity>;
  abstract findById(id: string, orgId: string): Promise<UserEntity | null>;
  abstract findByIdInternal(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByEmailAndOrg(email: string, orgId: string): Promise<UserEntity | null>;
  abstract findAllByOrg(orgId: string, options: PaginationOptions): Promise<[UserEntity[], number]>;
  abstract findSubordinates(parentId: string, orgId: string): Promise<UserEntity[]>;
  abstract update(id: string, orgId: string, data: Partial<UserEntity>, version: number): Promise<UserEntity | null>;
  abstract updateLastLogin(id: string): Promise<void>;
  abstract deactivate(id: string, orgId: string): Promise<boolean>;
}
```

### 6. Reliability & Consistency

- **Idempotency:** Signup uses `(org_id, email)` unique constraint as natural idempotency key. Duplicate POST returns 409 Conflict.
- **Concurrency:** User updates use optimistic locking via `version` column. Client must send current version; stale writes rejected with 409.
- **Consistency:** Strong consistency for user creation (DB unique constraint). Eventually consistent for permission propagation (JWT tokens carry permissions; changes take effect on next token refresh).
- **Fault tolerance:** Health checks for readiness probes. Auth service must be highly available (3+ replicas).

### 7. Caching (Redis)

| Data | Key Pattern | TTL | Invalidation |
|------|-------------|-----|--------------|
| User permissions | `user:{userId}:permissions` | 5min | Explicit on role/permission change |
| Role + permissions | `role:{roleId}:full` | 10min | Explicit on role update |
| Org settings | `org:{orgId}:settings` | 15min | Explicit on org update |
| Token blacklist | `blacklist:{tokenJti}` | Token remaining TTL | Write-through on logout |

### 8. Integrations & Patterns

- **Patterns:** Strategy pattern for authentication methods (JWT, API key, service token). Factory pattern for token generation (access vs refresh). Repository pattern for data access abstraction.
- **Cron:** Expired refresh token cleanup (daily), inactive user report (weekly)
- **Events emitted:** `user.created`, `user.deactivated`, `password.reset.requested`

### 9. Operational Concerns

- class-validator DTOs on all inputs with whitelist + forbidNonWhitelisted
- Global exception filter with structured error response `{ success, error: { code, message } }`
- Correlation ID middleware (x-correlation-id header propagated to all downstream calls)
- Structured JSON logging via pino with userId, orgId, correlationId in every log line

### 10. AI/RAG Opportunities

- Anomaly detection on login patterns (unusual location, time, device)
- Risk scoring for permission escalation requests

---

## SERVICE 2: EXPENSE MANAGEMENT

### 1. Requirements Analysis

**Functional Requirements:**
- Expense submission with receipt attachments (images/PDFs)
- Expense categorization (travel, meals, office supplies, etc.)
- Multi-level approval workflows (configurable per org)
- Expense policies with limits (per category, per role, per period)
- Reimbursement tracking and status
- Expense reports (group expenses into reports for bulk approval)
- Recurring expense templates
- Mileage tracking and per-diem calculations

**Non-Functional Requirements:**
- File uploads: support up to 10MB per receipt
- Approval latency: < 100ms for status queries
- Eventual consistency acceptable for report aggregation
- Strong consistency for approval state transitions

**Key Assumptions:**
- Approval workflow definition stored in Workflow service; Expense service triggers and tracks state
- Reimbursement is a trigger to Payroll service (async event)
- org_id + policy enforcement ensures tenant isolation
- Soft delete for audit trail on expenses

### 2. Module Breakdown

| Module | Responsibility |
|--------|---------------|
| `expenses` | Individual expense CRUD, receipt upload, status tracking |
| `categories` | Expense category management per org |
| `policies` | Spending limits, approval thresholds, category restrictions |
| `reports` | Group expenses into reports, bulk submission |
| `approvals` | Approval state machine, approval/rejection with comments |
| `reimbursements` | Track reimbursement status from Payroll |
| `health` | Service health endpoint |

### 3. Database Schema

```sql
-- TABLE: expense_categories
CREATE TABLE expense_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX (cross-service ref to users-management)
  name          VARCHAR(100) NOT NULL,
  code          VARCHAR(50) NOT NULL,
  description   VARCHAR(500),
  parent_id     UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP                             -- soft delete
);
-- Indexes: IDX_CAT_ORG_CODE (org_id, code) UNIQUE, IDX_CAT_PARENT

-- TABLE: expense_policies
CREATE TABLE expense_policies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  name          VARCHAR(200) NOT NULL,
  category_id   UUID REFERENCES expense_categories(id),
  role_id       UUID,                                 -- cross-service ref (users-management)
  max_amount    DECIMAL(15,2),
  currency      VARCHAR(3) DEFAULT 'INR',
  period        VARCHAR(20),                          -- 'per_expense', 'daily', 'monthly', 'yearly'
  requires_receipt_above DECIMAL(15,2) DEFAULT 0,
  auto_approve_below    DECIMAL(15,2),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_POLICY_ORG, IDX_POLICY_CATEGORY

-- TABLE: expense_reports
CREATE TABLE expense_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  user_id       UUID NOT NULL,                        -- cross-service ref
  title         VARCHAR(255) NOT NULL,
  status        VARCHAR(30) DEFAULT 'draft',          -- draft, submitted, approved, rejected, reimbursed
  total_amount  DECIMAL(15,2) DEFAULT 0,
  currency      VARCHAR(3) DEFAULT 'INR',
  submitted_at  TIMESTAMP,
  approved_at   TIMESTAMP,
  approved_by   UUID,                                 -- cross-service ref
  version       INT DEFAULT 1,                        -- optimistic locking
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP
);
-- Indexes: IDX_REPORT_ORG_USER, IDX_REPORT_STATUS, IDX_REPORT_ORG_STATUS

-- TABLE: expenses
CREATE TABLE expenses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL,                      -- INDEX
  user_id         UUID NOT NULL,                      -- cross-service ref
  report_id       UUID REFERENCES expense_reports(id) ON DELETE SET NULL,
  category_id     UUID REFERENCES expense_categories(id),
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  amount          DECIMAL(15,2) NOT NULL,
  currency        VARCHAR(3) DEFAULT 'INR',
  expense_date    DATE NOT NULL,
  merchant_name   VARCHAR(255),
  receipt_url     TEXT,
  receipt_metadata JSONB,                             -- OCR results, file info
  status          VARCHAR(30) DEFAULT 'draft',        -- draft, pending, approved, rejected
  policy_violation VARCHAR(500),                      -- if policy violated, reason stored
  idempotency_key VARCHAR(64),                        -- INDEX UNIQUE for dedup
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP
);
-- Indexes: IDX_EXPENSE_ORG_USER, IDX_EXPENSE_REPORT, IDX_EXPENSE_STATUS, IDX_EXPENSE_IDEMPOTENCY (unique)

-- TABLE: expense_approvals
CREATE TABLE expense_approvals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  expense_id    UUID REFERENCES expenses(id),
  report_id     UUID REFERENCES expense_reports(id),
  approver_id   UUID NOT NULL,                        -- cross-service ref
  level         INT NOT NULL DEFAULT 1,               -- approval level in chain
  status        VARCHAR(20) NOT NULL,                 -- pending, approved, rejected
  comments      TEXT,
  decided_at    TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_APPROVAL_EXPENSE, IDX_APPROVAL_APPROVER, IDX_APPROVAL_STATUS

-- TABLE: reimbursements
CREATE TABLE reimbursements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  report_id     UUID NOT NULL REFERENCES expense_reports(id),
  user_id       UUID NOT NULL,
  amount        DECIMAL(15,2) NOT NULL,
  currency      VARCHAR(3) DEFAULT 'INR',
  status        VARCHAR(30) DEFAULT 'pending',        -- pending, processing, completed, failed
  payroll_ref   VARCHAR(255),                         -- reference from payroll service
  processed_at  TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_REIMB_ORG_USER, IDX_REIMB_REPORT, IDX_REIMB_STATUS
```

**Cross-Service References:**
- `user_id`, `org_id`, `approved_by` → resolved via REST to User Management or JWT payload
- `role_id` in policies → resolved via REST to User Management
- Reimbursement triggers event to Payroll service

### 4. Architecture Decision

**Why separate:** Expense management has complex domain logic (policy validation, multi-level approvals, file uploads) and distinct scaling characteristics (bursty uploads, batch processing for reports). Separating allows independent deployment of receipt processing and approval logic.

**Communication:**
- Expense → User Management: **Sync REST** (validate approver, get user details)
- Expense → Workflow: **Sync REST** (get approval chain definition)
- Expense → Payroll: **Async (Kafka topic: `expense.reimbursement.approved`)** for reimbursement
- Expense → Notification: **Async (Kafka topic: `expense.status.changed`)** for approval/rejection notifications

### 5. API Design

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/v1/expenses | Create expense |
| GET | /api/v1/expenses | List expenses (paginated, filtered) |
| GET | /api/v1/expenses/:id | Get expense detail |
| PATCH | /api/v1/expenses/:id | Update expense (draft only) |
| DELETE | /api/v1/expenses/:id | Soft delete expense |
| POST | /api/v1/expenses/:id/receipt | Upload receipt |
| GET | /api/v1/categories | List expense categories |
| POST | /api/v1/categories | Create category (admin) |
| PATCH | /api/v1/categories/:id | Update category |
| GET | /api/v1/reports | List expense reports |
| POST | /api/v1/reports | Create expense report |
| POST | /api/v1/reports/:id/submit | Submit report for approval |
| POST | /api/v1/reports/:id/approve | Approve report |
| POST | /api/v1/reports/:id/reject | Reject report |
| GET | /api/v1/policies | List policies |
| POST | /api/v1/policies | Create policy (admin) |
| PATCH | /api/v1/policies/:id | Update policy |
| GET | /api/v1/reimbursements | List reimbursements |

**Repository Interface (ExpenseRepository):**
```typescript
abstract class ExpenseRepository {
  abstract create(data: Partial<ExpenseEntity>): Promise<ExpenseEntity>;
  abstract findById(id: string, orgId: string): Promise<ExpenseEntity | null>;
  abstract findByIdempotencyKey(key: string): Promise<ExpenseEntity | null>;
  abstract findAllByOrg(orgId: string, filters: ExpenseFilters, pagination: PaginationOptions): Promise<[ExpenseEntity[], number]>;
  abstract findByUserAndOrg(userId: string, orgId: string, pagination: PaginationOptions): Promise<[ExpenseEntity[], number]>;
  abstract update(id: string, orgId: string, data: Partial<ExpenseEntity>): Promise<ExpenseEntity | null>;
  abstract softDelete(id: string, orgId: string): Promise<boolean>;
  abstract sumByUserAndPeriod(userId: string, categoryId: string, startDate: Date, endDate: Date): Promise<number>;
}
```

### 6. Reliability & Consistency

- **Idempotency:** `idempotency_key` column (client-generated) with unique constraint. Duplicate submissions return existing expense.
- **Concurrency:** Expense reports use optimistic locking (`version` column) to prevent concurrent approval/rejection.
- **Events:** 
  - `expense.reimbursement.approved` → Payroll (async, with DLQ for failures)
  - `expense.status.changed` → Notification (async, fire-and-forget)
- **Saga:** Expense approval → Reimbursement → Payroll processing. If payroll fails, reimbursement status set to `failed` (compensating action: notify user + admin).
- **Circuit breaker:** On calls to User Management (for approver validation) and Workflow service.

### 7. Caching (Redis)

| Data | Key Pattern | TTL | Invalidation |
|------|-------------|-----|--------------|
| Expense categories | `org:{orgId}:expense:categories` | 30min | Explicit on category CRUD |
| Expense policies | `org:{orgId}:expense:policies` | 15min | Explicit on policy CRUD |
| User expense summary | `org:{orgId}:user:{userId}:expense:summary:{period}` | 5min | Explicit on new expense |

### 8. Integrations & Patterns

- **Strategy pattern:** Policy validation (different strategies per policy type: per-expense, daily, monthly)
- **Factory pattern:** Receipt processor factory (different handlers for image vs PDF)
- **Observer:** Approval state changes trigger notifications and reimbursement processing
- **Cron:** Monthly expense report reminders, auto-expire drafts older than 90 days

### 9. Operational Concerns

- File upload validation (max 10MB, allowed MIME types)
- Amount precision validation (2 decimal places)
- Policy violation is warning (soft) not blocker by default; configurable per org

### 10. AI/RAG Opportunities

- **Receipt OCR:** Extract merchant, amount, date, category from receipt images
- **Auto-categorization:** ML model to suggest category based on merchant and description
- **Duplicate detection:** Flag potential duplicate expenses (same amount + date + merchant)
- **Policy suggestion:** Recommend policy adjustments based on spending patterns

---

## SERVICE 3: PAYROLL

### 1. Requirements Analysis

**Functional Requirements:**
- Employee salary structure management (base, allowances, deductions)
- Payroll cycle configuration (monthly, bi-weekly, weekly per org)
- Payroll run processing (batch calculation for all employees in org)
- Tax calculation (TDS, professional tax, provident fund)
- Reimbursement integration (from Expense service)
- Payslip generation (PDF)
- Salary revision history
- Statutory compliance (PF, ESI, TDS declarations)
- Bank disbursement file generation
- YTD (Year-to-Date) calculations

**Non-Functional Requirements:**
- Payroll run: batch processing, can take minutes for large orgs (async job)
- Strong consistency for salary calculations (no partial runs)
- Payslip queries: < 50ms (frequently accessed)
- Audit trail mandatory for all salary changes

**Key Assumptions:**
- One payroll run per cycle per org (idempotent)
- Tax rules are configurable per country/region (strategy pattern)
- Reimbursements arrive as events from Expense service
- Payroll processing is a long-running job (not a synchronous API)

### 2. Module Breakdown

| Module | Responsibility |
|--------|---------------|
| `salary-structures` | Define salary components (basic, HRA, DA, deductions) |
| `payroll-cycles` | Configure and manage pay periods |
| `payroll-runs` | Execute payroll calculation batch jobs |
| `payslips` | Generate and serve payslips |
| `tax` | Tax calculation engine (TDS, PF, ESI) |
| `reimbursements` | Receive and process expense reimbursements |
| `disbursements` | Bank file generation, payment tracking |
| `health` | Service health endpoint |

### 3. Database Schema

```sql
-- TABLE: salary_structures
CREATE TABLE salary_structures (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  user_id       UUID NOT NULL,                        -- cross-service ref
  base_salary   DECIMAL(15,2) NOT NULL,
  currency      VARCHAR(3) DEFAULT 'INR',
  components    JSONB NOT NULL,                       -- { "hra": 15000, "da": 5000, "special": 10000 }
  deductions    JSONB DEFAULT '{}',                   -- { "pf": 1800, "professional_tax": 200 }
  effective_from DATE NOT NULL,
  effective_to  DATE,                                 -- NULL = current
  is_current    BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_SALARY_ORG_USER (org_id, user_id), IDX_SALARY_EFFECTIVE

-- TABLE: payroll_cycles
CREATE TABLE payroll_cycles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  name          VARCHAR(100) NOT NULL,
  frequency     VARCHAR(20) NOT NULL,                 -- monthly, bi_weekly, weekly
  pay_day       INT NOT NULL,                         -- day of month (1-28)
  start_date    DATE NOT NULL,
  end_date      DATE,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_CYCLE_ORG (org_id)

-- TABLE: payroll_runs
CREATE TABLE payroll_runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  cycle_id      UUID NOT NULL REFERENCES payroll_cycles(id),
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  status        VARCHAR(30) DEFAULT 'pending',        -- pending, processing, completed, failed, cancelled
  total_gross   DECIMAL(15,2) DEFAULT 0,
  total_net     DECIMAL(15,2) DEFAULT 0,
  total_tax     DECIMAL(15,2) DEFAULT 0,
  employee_count INT DEFAULT 0,
  processed_by  UUID,                                 -- cross-service ref (who triggered)
  started_at    TIMESTAMP,
  completed_at  TIMESTAMP,
  error_details JSONB,
  lock_key      VARCHAR(64) UNIQUE,                   -- pessimistic lock: prevents concurrent runs
  idempotency_key VARCHAR(64) UNIQUE,                 -- org_id + cycle_id + period
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_RUN_ORG_CYCLE, IDX_RUN_STATUS, IDX_RUN_IDEMPOTENCY (unique), IDX_RUN_LOCK (unique)

-- TABLE: payslips
CREATE TABLE payslips (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  user_id       UUID NOT NULL,                        -- cross-service ref
  run_id        UUID NOT NULL REFERENCES payroll_runs(id),
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  gross_salary  DECIMAL(15,2) NOT NULL,
  net_salary    DECIMAL(15,2) NOT NULL,
  components    JSONB NOT NULL,                       -- detailed breakdown
  deductions    JSONB NOT NULL,                       -- tax, PF, etc.
  reimbursements DECIMAL(15,2) DEFAULT 0,
  ytd_gross     DECIMAL(15,2),
  ytd_tax       DECIMAL(15,2),
  pdf_url       TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_PAYSLIP_ORG_USER_PERIOD (org_id, user_id, period_start), IDX_PAYSLIP_RUN

-- TABLE: payroll_reimbursements
CREATE TABLE payroll_reimbursements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  user_id       UUID NOT NULL,
  expense_report_id UUID NOT NULL,                    -- cross-service ref to expense service
  amount        DECIMAL(15,2) NOT NULL,
  currency      VARCHAR(3) DEFAULT 'INR',
  status        VARCHAR(30) DEFAULT 'pending',        -- pending, included_in_payroll, paid
  included_in_run_id UUID REFERENCES payroll_runs(id),
  event_id      VARCHAR(64) UNIQUE,                   -- idempotency from event
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_REIMB_ORG_USER, IDX_REIMB_STATUS, IDX_REIMB_EVENT (unique)

-- TABLE: tax_declarations
CREATE TABLE tax_declarations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  user_id       UUID NOT NULL,
  financial_year VARCHAR(10) NOT NULL,                -- e.g. "2025-26"
  regime        VARCHAR(20) DEFAULT 'new',            -- old, new
  declarations  JSONB NOT NULL,                       -- { "80C": 150000, "80D": 25000 }
  status        VARCHAR(20) DEFAULT 'draft',          -- draft, submitted, verified
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_TAX_DECL_ORG_USER_FY (org_id, user_id, financial_year) UNIQUE
```

**Cross-Service References:**
- `user_id`, `org_id` → User Management (resolved via JWT or REST)
- `expense_report_id` → Expense Management (event-driven, stored as reference UUID)

### 4. Architecture Decision

**Why separate:** Payroll has high-stakes financial calculations requiring strong consistency, compliance requirements, and batch processing patterns fundamentally different from CRUD services. Separate deployment allows locking down access, independent scaling for batch runs, and isolated failure domain.

**Communication:**
- Payroll ← Expense: **Async (Kafka consumer: `expense.reimbursement.approved`)** to receive reimbursements
- Payroll → Notification: **Async (Kafka producer: `payroll.payslip.generated`)** for payslip notifications
- Payroll → User Management: **Sync REST** to get employee list and salary info
- Payroll → Reporting: **Async (Kafka producer: `payroll.run.completed`)** for analytics

### 5. API Design

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/v1/salary-structures/:userId | Get current salary structure |
| POST | /api/v1/salary-structures | Create/revise salary |
| GET | /api/v1/salary-structures/:userId/history | Salary revision history |
| GET | /api/v1/payroll-cycles | List payroll cycles |
| POST | /api/v1/payroll-cycles | Create cycle |
| POST | /api/v1/payroll-runs | Trigger payroll run |
| GET | /api/v1/payroll-runs | List runs (paginated) |
| GET | /api/v1/payroll-runs/:id | Get run details |
| POST | /api/v1/payroll-runs/:id/cancel | Cancel in-progress run |
| GET | /api/v1/payslips | List payslips (user's own or admin) |
| GET | /api/v1/payslips/:id | Get payslip detail |
| GET | /api/v1/payslips/:id/pdf | Download payslip PDF |
| GET | /api/v1/tax-declarations | Get user's tax declarations |
| POST | /api/v1/tax-declarations | Submit tax declaration |
| PATCH | /api/v1/tax-declarations/:id | Update declaration |

### 6. Reliability & Consistency

- **Idempotency:** Payroll runs use `idempotency_key` = hash(org_id + cycle_id + period_start + period_end). Duplicate trigger returns existing run.
- **Concurrency:** `lock_key` column with unique constraint prevents concurrent payroll runs for same org+period. Processing uses pessimistic lock pattern.
- **Consistency:** Strong consistency within payroll run (transaction wraps entire employee batch). If any employee calculation fails, entire run marked `failed` with error details.
- **Saga:** Payroll disbursement → Bank API → Confirmation. On failure: mark disbursement as `failed`, notify admin (compensating: retry queue).
- **DLQ:** Reimbursement events that fail processing go to `payroll.reimbursement.dlq` for manual review.
- **Circuit breaker:** On bank/payment gateway calls.

### 7. Caching (Redis)

| Data | Key Pattern | TTL | Invalidation |
|------|-------------|-----|--------------|
| Current salary structure | `org:{orgId}:salary:{userId}:current` | 1hr | Explicit on salary revision |
| Payslip metadata | `org:{orgId}:payslip:{payslipId}` | 24hr | Immutable (never changes) |
| Tax rules | `tax:rules:{country}:{fy}` | 7days | Manual refresh on rule change |
| Payroll run status | `org:{orgId}:run:{runId}:status` | 30s | Write-through during processing |

### 8. Integrations & Patterns

- **Strategy pattern:** Tax calculation engine (different strategies for India old regime vs new regime, different countries)
- **Factory pattern:** Disbursement handler factory (different banks have different file formats)
- **Template pattern:** Payslip PDF generation with org-specific templates
- **Third-party:** Bank APIs for disbursement, government portals for statutory filing
- **Cron:** Auto-trigger payroll run on configured pay day, reminder notifications 3 days before

### 9. Operational Concerns

- Payroll run progress tracked in Redis (real-time progress: `processed 150/500 employees`)
- All salary changes require audit trail with previous values
- Payslips are immutable once generated
- Financial amounts always stored as DECIMAL(15,2), never floating point

### 10. AI/RAG Opportunities

- Salary benchmarking: Compare against industry data
- Tax optimization suggestions based on declarations and spending patterns
- Anomaly detection in payroll calculations (unusual spikes)

---

## SERVICE 4: WORKFLOW

### 1. Requirements Analysis

**Functional Requirements:**
- Workflow template definition (multi-step approval chains)
- Dynamic approver resolution (by role, by hierarchy, specific user)
- Workflow instance creation and state tracking
- Approval/rejection at each step with comments
- Escalation rules (auto-escalate after N days)
- Parallel and sequential approval paths
- Workflow versioning (changes don't affect in-progress instances)
- SLA tracking per step

**Non-Functional Requirements:**
- Workflow state transitions: strongly consistent
- Template queries: < 20ms (heavily cached)
- Support thousands of concurrent workflow instances
- State transitions must be atomic

**Key Assumptions:**
- Workflow service is stateless; state stored in DB
- Other services trigger workflow instances; Workflow service manages state
- Approver resolution uses User Management hierarchy data
- Each org can define custom workflow templates

### 2. Module Breakdown

| Module | Responsibility |
|--------|---------------|
| `templates` | Workflow template CRUD, versioning |
| `instances` | Workflow instance lifecycle management |
| `steps` | Individual step execution, approver assignment |
| `rules` | Escalation rules, SLA definitions |
| `approver-resolution` | Strategy-based approver determination |
| `health` | Service health endpoint |

### 3. Database Schema

```sql
-- TABLE: workflow_templates
CREATE TABLE workflow_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  trigger_type  VARCHAR(50) NOT NULL,                 -- expense_report, invoice, leave_request
  version       INT DEFAULT 1,
  steps_config  JSONB NOT NULL,                       -- ordered steps definition
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP
);
-- Indexes: IDX_TEMPLATE_ORG_TRIGGER (org_id, trigger_type), IDX_TEMPLATE_ORG_NAME

-- TABLE: workflow_instances
CREATE TABLE workflow_instances (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  template_id   UUID NOT NULL REFERENCES workflow_templates(id),
  template_version INT NOT NULL,
  trigger_entity_type VARCHAR(50) NOT NULL,           -- expense_report, invoice
  trigger_entity_id   UUID NOT NULL,                  -- cross-service ref
  initiated_by  UUID NOT NULL,                        -- cross-service ref (user_id)
  status        VARCHAR(30) DEFAULT 'active',         -- active, completed, rejected, cancelled, escalated
  current_step  INT DEFAULT 1,
  metadata      JSONB DEFAULT '{}',                   -- entity snapshot for context
  started_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at  TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_INSTANCE_ORG, IDX_INSTANCE_TRIGGER (trigger_entity_type, trigger_entity_id), IDX_INSTANCE_STATUS

-- TABLE: workflow_steps
CREATE TABLE workflow_steps (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id   UUID NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
  step_number   INT NOT NULL,
  approver_type VARCHAR(30) NOT NULL,                 -- role, hierarchy, specific_user
  approver_id   UUID,                                 -- resolved approver (cross-service ref)
  approver_role VARCHAR(50),                          -- if type=role, which role
  status        VARCHAR(20) DEFAULT 'pending',        -- pending, approved, rejected, skipped, escalated
  comments      TEXT,
  sla_hours     INT,
  escalate_to   UUID,                                 -- cross-service ref
  decided_at    TIMESTAMP,
  due_at        TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_STEP_INSTANCE (instance_id), IDX_STEP_APPROVER (approver_id), IDX_STEP_STATUS, IDX_STEP_DUE

-- TABLE: escalation_rules
CREATE TABLE escalation_rules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  template_id   UUID REFERENCES workflow_templates(id),
  step_number   INT,
  hours_before_escalation INT NOT NULL DEFAULT 48,
  escalate_to_type VARCHAR(30) NOT NULL,              -- hierarchy_up, specific_user, role
  escalate_to_value VARCHAR(255),
  notify_on_escalation BOOLEAN DEFAULT true,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_ESCALATION_ORG_TEMPLATE
```

**Cross-Service References:**
- `trigger_entity_id` → Expense/Invoice service entity
- `initiated_by`, `approver_id`, `escalate_to` → User Management
- Approver resolution calls User Management for hierarchy

### 4. Architecture Decision

**Why separate:** Workflow is a horizontal concern used by multiple services (Expense, Invoice, Leave, etc.). Centralizing workflow logic prevents duplication and ensures consistent approval behavior. Different trigger services should not know about approval chain internals.

**Communication:**
- Workflow ← Expense/Invoice: **Sync REST** (trigger workflow instance creation)
- Workflow → User Management: **Sync REST** (resolve approvers from hierarchy)
- Workflow → Notification: **Async (Kafka: `workflow.step.pending`)** for approval request notifications
- Workflow → Expense/Invoice: **Async (Kafka: `workflow.instance.completed`)** to update entity status

### 5. API Design

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/v1/templates | List workflow templates |
| POST | /api/v1/templates | Create template |
| GET | /api/v1/templates/:id | Get template detail |
| PATCH | /api/v1/templates/:id | Update template (creates new version) |
| POST | /api/v1/instances | Create workflow instance (called by other services) |
| GET | /api/v1/instances | List instances (filtered by status, entity) |
| GET | /api/v1/instances/:id | Get instance with steps |
| POST | /api/v1/instances/:id/cancel | Cancel workflow |
| GET | /api/v1/steps/pending | Get pending approvals for current user |
| POST | /api/v1/steps/:id/approve | Approve step |
| POST | /api/v1/steps/:id/reject | Reject step |
| GET | /api/v1/escalation-rules | List escalation rules |
| POST | /api/v1/escalation-rules | Create rule |

### 6. Reliability & Consistency

- **Idempotency:** Workflow instance creation uses `(trigger_entity_type, trigger_entity_id)` as natural key. If instance already exists for entity, return existing.
- **Concurrency:** Step approval uses SELECT FOR UPDATE (pessimistic lock) to prevent race conditions on same step.
- **Consistency:** Strong consistency for step transitions (DB transaction). Instance status derived from step statuses.
- **Events produced:** `workflow.step.pending`, `workflow.instance.completed`, `workflow.instance.rejected`, `workflow.step.escalated`
- **Fault tolerance:** If notification delivery fails, workflow state is not affected (fire-and-forget for notifications). Entity status update failures go to retry queue.

### 7. Caching (Redis)

| Data | Key Pattern | TTL | Invalidation |
|------|-------------|-----|--------------|
| Workflow templates | `org:{orgId}:wf:template:{triggerId}` | 30min | Explicit on template update |
| Pending approvals count | `user:{userId}:pending_approvals` | 1min | Explicit on step transition |
| Approver resolution | `org:{orgId}:approver:{userId}:chain` | 5min | Explicit on hierarchy change |

### 8. Integrations & Patterns

- **Strategy pattern:** Approver resolution (ByHierarchy, ByRole, BySpecificUser strategies)
- **State machine pattern:** Workflow instance and step status transitions with defined valid transitions
- **Observer/Event pattern:** State changes emit events consumed by Notification and triggering services
- **Cron:** Escalation checker (every 15min) — find overdue steps and escalate

### 9. Operational Concerns

- Workflow template changes create new versions (in-progress instances use snapshot)
- SLA breach logging with alerting
- Correlation IDs link workflow instance to original entity across services

### 10. AI/RAG Opportunities

- Predict approval likelihood based on historical patterns
- Auto-suggest approval chains based on expense/invoice type and amount
- Bottleneck detection (identify approvers causing delays)

---

## SERVICE 5: INVOICE MANAGEMENT

### 1. Requirements Analysis

**Functional Requirements:**
- Invoice creation with line items (products/services)
- Invoice numbering (sequential per org, configurable format)
- Tax calculation (GST, VAT, configurable per region)
- Invoice status management (draft → sent → paid → overdue → cancelled)
- Recurring invoice generation
- Credit notes and debit notes
- Payment recording (partial and full)
- PDF generation with org branding
- Due date tracking and overdue notifications
- Multi-currency support with exchange rates

**Non-Functional Requirements:**
- Invoice number generation: sequential, gap-free, conflict-free (strong consistency)
- PDF generation: async (can take 2-5s)
- Invoice queries: < 50ms p99
- Support bulk invoice generation (recurring)

**Key Assumptions:**
- Invoice numbers are sequential within org (no gaps allowed)
- Tax rules vary by region and are configurable per org
- Payment integration is reference-based (payment gateway webhook)
- Customer data stored locally (denormalized from external CRM or inline)

### 2. Module Breakdown

| Module | Responsibility |
|--------|---------------|
| `invoices` | Invoice CRUD, status management, line items |
| `numbering` | Sequential invoice number generation (thread-safe) |
| `tax` | Tax calculation engine (GST, VAT, configurable) |
| `payments` | Payment recording, reconciliation |
| `recurring` | Recurring invoice templates and auto-generation |
| `credit-notes` | Credit note creation and linkage |
| `pdf` | PDF generation with templates |
| `customers` | Customer/client registry per org |
| `health` | Service health endpoint |

### 3. Database Schema

```sql
-- TABLE: customers (invoice recipients)
CREATE TABLE customers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255),
  phone         VARCHAR(20),
  billing_address JSONB,
  shipping_address JSONB,
  tax_id        VARCHAR(50),                          -- GST/VAT number
  currency      VARCHAR(3) DEFAULT 'INR',
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP
);
-- Indexes: IDX_CUSTOMER_ORG (org_id), IDX_CUSTOMER_ORG_EMAIL (org_id, email)

-- TABLE: invoice_numbering
CREATE TABLE invoice_numbering (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL UNIQUE,                 -- one per org
  prefix        VARCHAR(20) DEFAULT 'INV',
  separator     VARCHAR(5) DEFAULT '-',
  current_number BIGINT DEFAULT 0,
  format        VARCHAR(100) DEFAULT '{prefix}{separator}{number}',  -- e.g. INV-00001
  padding       INT DEFAULT 5,
  financial_year_reset BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_NUMBERING_ORG (unique)
-- NOTE: current_number updated with SELECT FOR UPDATE to prevent gaps

-- TABLE: invoices
CREATE TABLE invoices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  invoice_number VARCHAR(50) NOT NULL,                -- INDEX (org_id + invoice_number UNIQUE)
  customer_id   UUID NOT NULL REFERENCES customers(id),
  status        VARCHAR(30) DEFAULT 'draft',          -- draft, sent, partially_paid, paid, overdue, cancelled, void
  issue_date    DATE NOT NULL,
  due_date      DATE NOT NULL,
  subtotal      DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_amount    DECIMAL(15,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total_amount  DECIMAL(15,2) NOT NULL DEFAULT 0,
  amount_paid   DECIMAL(15,2) DEFAULT 0,
  amount_due    DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency      VARCHAR(3) DEFAULT 'INR',
  exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
  notes         TEXT,
  terms         TEXT,
  pdf_url       TEXT,
  recurring_id  UUID,                                 -- if generated from recurring template
  metadata      JSONB DEFAULT '{}',
  version       INT DEFAULT 1,                        -- optimistic locking
  created_by    UUID NOT NULL,                        -- cross-service ref
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP
);
-- Indexes: IDX_INV_ORG_NUMBER (org_id, invoice_number) UNIQUE, IDX_INV_ORG_STATUS, IDX_INV_CUSTOMER, IDX_INV_DUE_DATE

-- TABLE: invoice_line_items
CREATE TABLE invoice_line_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id    UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description   VARCHAR(500) NOT NULL,
  quantity      DECIMAL(10,3) NOT NULL DEFAULT 1,
  unit_price    DECIMAL(15,2) NOT NULL,
  tax_rate      DECIMAL(5,2) DEFAULT 0,              -- percentage
  tax_amount    DECIMAL(15,2) DEFAULT 0,
  discount_rate DECIMAL(5,2) DEFAULT 0,
  line_total    DECIMAL(15,2) NOT NULL,
  hsn_code      VARCHAR(20),                          -- for GST
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_LINE_INVOICE (invoice_id)

-- TABLE: invoice_payments
CREATE TABLE invoice_payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  invoice_id    UUID NOT NULL REFERENCES invoices(id),
  amount        DECIMAL(15,2) NOT NULL,
  currency      VARCHAR(3) DEFAULT 'INR',
  payment_method VARCHAR(50),                         -- bank_transfer, upi, credit_card, cash
  payment_date  DATE NOT NULL,
  reference_number VARCHAR(255),
  gateway_ref   VARCHAR(255),                         -- payment gateway reference
  notes         TEXT,
  idempotency_key VARCHAR(64) UNIQUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_PAYMENT_INVOICE, IDX_PAYMENT_ORG, IDX_PAYMENT_IDEMPOTENCY (unique)

-- TABLE: recurring_invoices
CREATE TABLE recurring_invoices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  customer_id   UUID NOT NULL REFERENCES customers(id),
  frequency     VARCHAR(20) NOT NULL,                 -- weekly, monthly, quarterly, yearly
  next_issue_date DATE NOT NULL,
  end_date      DATE,
  line_items    JSONB NOT NULL,
  notes         TEXT,
  terms         TEXT,
  is_active     BOOLEAN DEFAULT true,
  last_generated_at TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_RECURRING_ORG, IDX_RECURRING_NEXT_DATE

-- TABLE: credit_notes
CREATE TABLE credit_notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  invoice_id    UUID NOT NULL REFERENCES invoices(id),
  credit_number VARCHAR(50) NOT NULL,
  amount        DECIMAL(15,2) NOT NULL,
  reason        TEXT NOT NULL,
  status        VARCHAR(20) DEFAULT 'issued',         -- issued, applied, void
  created_by    UUID NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_CREDIT_ORG_NUMBER (org_id, credit_number) UNIQUE, IDX_CREDIT_INVOICE
```

### 4. Architecture Decision

**Why separate:** Invoice management has distinct compliance requirements (sequential numbering, tax compliance, audit trails), complex calculation logic, and integration with external payment gateways and tax APIs. It also generates significant file I/O (PDFs) with different scaling characteristics.

**Communication:**
- Invoice → Workflow: **Sync REST** (trigger approval workflow for high-value invoices)
- Invoice → Notification: **Async (Kafka: `invoice.sent`, `invoice.overdue`, `invoice.paid`)**
- Invoice → Reporting: **Async (Kafka: `invoice.created`, `invoice.paid`)** for revenue analytics
- Invoice ← Payment Gateway: **Webhook** (payment confirmation)

### 5. API Design

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/v1/invoices | Create invoice |
| GET | /api/v1/invoices | List invoices (paginated, filtered) |
| GET | /api/v1/invoices/:id | Get invoice detail with line items |
| PATCH | /api/v1/invoices/:id | Update invoice (draft only) |
| POST | /api/v1/invoices/:id/send | Mark as sent (triggers notification) |
| POST | /api/v1/invoices/:id/void | Void invoice |
| DELETE | /api/v1/invoices/:id | Soft delete (draft only) |
| GET | /api/v1/invoices/:id/pdf | Get/generate PDF |
| POST | /api/v1/invoices/:id/payments | Record payment |
| GET | /api/v1/invoices/:id/payments | List payments for invoice |
| GET | /api/v1/customers | List customers |
| POST | /api/v1/customers | Create customer |
| PATCH | /api/v1/customers/:id | Update customer |
| GET | /api/v1/recurring | List recurring templates |
| POST | /api/v1/recurring | Create recurring invoice |
| PATCH | /api/v1/recurring/:id | Update recurring |
| POST | /api/v1/credit-notes | Create credit note |
| GET | /api/v1/credit-notes | List credit notes |

### 6. Reliability & Consistency

- **Idempotency:** Payment recording uses `idempotency_key` (gateway reference or client-generated). Duplicate payment requests return existing record.
- **Concurrency:** Invoice numbering uses `SELECT FOR UPDATE` on `invoice_numbering` row (pessimistic lock) to guarantee sequential, gap-free numbers.
- **Consistency:** Invoice totals recalculated atomically when line items change (single transaction).
- **Events:** `invoice.sent`, `invoice.paid`, `invoice.overdue`, `invoice.created`
- **Saga:** High-value invoice → Workflow approval → Send. If workflow rejects, invoice stays in draft. Payment gateway timeout → retry with idempotency key.

### 7. Caching (Redis)

| Data | Key Pattern | TTL | Invalidation |
|------|-------------|-----|--------------|
| Invoice numbering config | `org:{orgId}:inv:numbering` | 1hr | Explicit on config change |
| Customer list | `org:{orgId}:inv:customers` | 15min | Explicit on customer CRUD |
| Tax rates | `org:{orgId}:inv:tax:rates` | 1hr | Explicit on rate change |
| Invoice PDF URL | `inv:{invoiceId}:pdf` | 24hr | Explicit on regeneration |

### 8. Integrations & Patterns

- **Strategy pattern:** Tax calculation (GST India, VAT EU, Sales Tax US — different strategies per region)
- **Factory pattern:** PDF template factory (different templates per org branding)
- **Decorator pattern:** Line item calculations (base price → discount → tax in chain)
- **Third-party:** Payment gateways (Razorpay, Stripe), Tax APIs (GST validation), Email for invoice delivery
- **Cron:** Recurring invoice generation (daily check), overdue invoice marking (daily), payment reminders (configurable)

### 9. Operational Concerns

- Invoice numbers are immutable once assigned
- Void and credit note instead of delete for sent invoices
- All amounts stored as DECIMAL(15,2)
- Currency conversion rates stored per invoice (historical accuracy)

### 10. AI/RAG Opportunities

- **Fraud/anomaly detection:** Flag unusual invoice patterns (sudden large invoices, new customers with large amounts)
- **Smart line items:** Auto-suggest descriptions and pricing based on history
- **Payment prediction:** Predict likelihood and timing of payment based on customer history

---

## SERVICE 6: NOTIFICATION

### 1. Requirements Analysis

**Functional Requirements:**
- Multi-channel notification delivery (email, SMS, push, in-app)
- Template management with variable substitution
- Notification preferences per user (opt-in/out per channel, per type)
- Batch/bulk notification support
- Delivery tracking and retry
- Notification history and read status
- Rate limiting to prevent spam
- Scheduled notifications

**Non-Functional Requirements:**
- Email delivery: < 5s after event received
- Push notification: < 2s
- Handle 10K+ notifications/minute (burst during payroll runs)
- Eventually consistent (delivery tracking)
- At-least-once delivery guarantee

**Key Assumptions:**
- All notifications are triggered by events from other services (never directly by users)
- Template engine supports Handlebars-style variable substitution
- Provider abstraction allows swapping email/SMS providers without code changes
- In-app notifications stored for 90-day retention

### 2. Module Breakdown

| Module | Responsibility |
|--------|---------------|
| `templates` | Notification template CRUD with variable definitions |
| `preferences` | User notification preferences management |
| `dispatcher` | Route notifications to appropriate channel handler |
| `channels/email` | Email delivery via provider (SES, SendGrid) |
| `channels/sms` | SMS delivery via provider (Twilio, SNS) |
| `channels/push` | Push notification delivery (FCM, APNs) |
| `channels/in-app` | In-app notification storage and retrieval |
| `delivery` | Delivery tracking, retry logic, DLQ management |
| `health` | Service health endpoint |

### 3. Database Schema

```sql
-- TABLE: notification_templates
CREATE TABLE notification_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID,                                 -- NULL = system template
  name          VARCHAR(200) NOT NULL,
  event_type    VARCHAR(100) NOT NULL,                -- e.g. expense.approved, payslip.generated
  channel       VARCHAR(20) NOT NULL,                 -- email, sms, push, in_app
  subject       VARCHAR(500),                         -- for email
  body_template TEXT NOT NULL,                        -- Handlebars template
  variables     JSONB DEFAULT '[]',                   -- expected variables list
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_TEMPLATE_EVENT_CHANNEL (event_type, channel), IDX_TEMPLATE_ORG

-- TABLE: notification_preferences
CREATE TABLE notification_preferences (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  user_id       UUID NOT NULL,                        -- cross-service ref
  event_type    VARCHAR(100) NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled   BOOLEAN DEFAULT false,
  push_enabled  BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_PREF_USER_EVENT (user_id, event_type) UNIQUE

-- TABLE: notifications (in-app notifications)
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  user_id       UUID NOT NULL,                        -- INDEX
  event_type    VARCHAR(100) NOT NULL,
  title         VARCHAR(255) NOT NULL,
  body          TEXT,
  action_url    VARCHAR(500),
  is_read       BOOLEAN DEFAULT false,
  read_at       TIMESTAMP,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_NOTIF_USER_READ (user_id, is_read), IDX_NOTIF_ORG_USER, IDX_NOTIF_CREATED

-- TABLE: delivery_logs
CREATE TABLE delivery_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  user_id       UUID NOT NULL,
  channel       VARCHAR(20) NOT NULL,
  event_type    VARCHAR(100) NOT NULL,
  status        VARCHAR(20) NOT NULL,                 -- queued, sent, delivered, failed, bounced
  provider      VARCHAR(50),                          -- ses, sendgrid, twilio, fcm
  provider_message_id VARCHAR(255),
  error_message TEXT,
  retry_count   INT DEFAULT 0,
  event_id      VARCHAR(64) UNIQUE,                   -- idempotency from source event
  sent_at       TIMESTAMP,
  delivered_at  TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_DELIVERY_USER, IDX_DELIVERY_STATUS, IDX_DELIVERY_EVENT (unique)

-- TABLE: device_tokens (for push notifications)
CREATE TABLE device_tokens (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL,
  platform      VARCHAR(20) NOT NULL,                 -- ios, android, web
  token         TEXT NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  last_used_at  TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_DEVICE_USER (user_id), IDX_DEVICE_TOKEN
```

### 4. Architecture Decision

**Why separate:** Notification is a pure infrastructure concern with I/O-bound workload (external API calls to email/SMS/push providers). It has fundamentally different scaling needs (burst traffic), requires independent retry/DLQ management, and provider changes should not affect business services.

**Communication:**
- Notification ← All Services: **Async (Kafka consumer)** — listens to notification events from all services
- Notification → User Management: **Sync REST** (resolve user email/phone for delivery)
- Notification → External Providers: **Async** (email, SMS, push APIs)

**Kafka Topics Consumed:**
- `expense.status.changed`
- `payroll.payslip.generated`
- `workflow.step.pending`
- `workflow.step.escalated`
- `invoice.sent`
- `invoice.overdue`
- `user.created`
- `user.password.reset`

### 5. API Design

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/v1/notifications | List in-app notifications (user's) |
| GET | /api/v1/notifications/unread-count | Get unread count |
| PATCH | /api/v1/notifications/:id/read | Mark as read |
| POST | /api/v1/notifications/mark-all-read | Mark all as read |
| GET | /api/v1/preferences | Get user's notification preferences |
| PUT | /api/v1/preferences | Update preferences |
| GET | /api/v1/templates | List templates (admin) |
| POST | /api/v1/templates | Create template (admin) |
| PATCH | /api/v1/templates/:id | Update template |
| POST | /api/v1/device-tokens | Register device token |
| DELETE | /api/v1/device-tokens/:id | Remove device token |

**Internal Endpoints:**
| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/v1/internal/send | Direct notification send (service-to-service) |

### 6. Reliability & Consistency

- **Idempotency:** `event_id` on delivery_logs ensures same event is not processed twice. Kafka consumer uses consumer groups with manual offset commit after successful processing.
- **At-least-once delivery:** Failed notifications are retried with exponential backoff (3 retries, then DLQ).
- **Rate limiting:** Per-user rate limit (max 50 notifications/hour) to prevent spam during bulk operations.
- **DLQ:** `notification.delivery.dlq` for permanently failed deliveries (admin review).
- **Circuit breaker:** Per provider (if SES is down, don't keep retrying; fail fast and queue).

### 7. Caching (Redis)

| Data | Key Pattern | TTL | Invalidation |
|------|-------------|-----|--------------|
| User preferences | `user:{userId}:notif:prefs` | 30min | Explicit on preference update |
| Unread count | `user:{userId}:notif:unread` | 1min | Increment/decrement on events |
| Template (compiled) | `notif:template:{eventType}:{channel}:{orgId}` | 1hr | Explicit on template update |
| Rate limit counter | `notif:rate:{userId}:{hour}` | 1hr | Auto-expire |

### 8. Integrations & Patterns

- **Factory pattern:** `NotificationChannelFactory` — creates appropriate channel handler (EmailChannel, SmsChannel, PushChannel)
- **Strategy pattern:** Provider selection (SES vs SendGrid for email, based on region/cost)
- **Template method:** Base notification processor with channel-specific implementations
- **Third-party:** AWS SES / SendGrid (email), Twilio / AWS SNS (SMS), Firebase FCM (push)
- **Cron:** Scheduled notification dispatch, delivery log cleanup (90 days), bounced email processing

### 9. Operational Concerns

- Provider-agnostic interface allows hot-swapping email/SMS providers
- Delivery logs retained for compliance (90 days)
- Bounce/complaint handling (auto-deactivate emails that bounce)
- Template versioning for rollback

### 10. AI/RAG Opportunities

- **Smart notification timing:** Learn when users are most likely to engage, schedule accordingly
- **Content personalization:** Adjust notification tone/content based on user engagement history
- **Channel optimization:** Route to channel with highest open rate per user

---

## SERVICE 7: REPORTING

### 1. Requirements Analysis

**Functional Requirements:**
- Pre-built reports (expense summary, payroll summary, invoice aging, etc.)
- Custom report builder (select dimensions, measures, filters)
- Report scheduling (daily/weekly/monthly email delivery)
- Export formats (PDF, CSV, Excel)
- Dashboard widgets (real-time counters and charts data)
- Data aggregation across time periods
- Role-based report visibility
- Report sharing within org

**Non-Functional Requirements:**
- Dashboard queries: < 500ms (aggregated/materialized views)
- Report generation: async (can take 10-30s for complex reports)
- Data freshness: near-real-time for dashboards (< 5min lag)
- Read-heavy workload (separate read replicas)

**Key Assumptions:**
- Reporting service maintains its own read-optimized data store (materialized views / OLAP tables)
- Data ingested via Kafka events from all services (event-sourced)
- No direct writes from users (read-only + report configuration)
- Cross-org data never mixed (tenant isolation at query level)

### 2. Module Breakdown

| Module | Responsibility |
|--------|---------------|
| `reports` | Report definition, execution, export |
| `dashboards` | Dashboard widget configuration and data |
| `data-ingestion` | Kafka consumer to ingest events into reporting tables |
| `scheduler` | Cron-based report generation and email delivery |
| `exports` | PDF/CSV/Excel generation |
| `health` | Service health endpoint |

### 3. Database Schema

```sql
-- TABLE: report_definitions
CREATE TABLE report_definitions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,                        -- INDEX
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  type          VARCHAR(50) NOT NULL,                 -- expense_summary, payroll, invoice_aging, custom
  config        JSONB NOT NULL,                       -- dimensions, measures, filters, grouping
  visibility    VARCHAR(20) DEFAULT 'private',        -- private, org, role-based
  allowed_roles JSONB DEFAULT '[]',
  created_by    UUID NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_REPORT_DEF_ORG, IDX_REPORT_DEF_TYPE

-- TABLE: report_schedules
CREATE TABLE report_schedules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  report_id     UUID NOT NULL REFERENCES report_definitions(id),
  frequency     VARCHAR(20) NOT NULL,                 -- daily, weekly, monthly
  day_of_week   INT,                                  -- 0-6 for weekly
  day_of_month  INT,                                  -- 1-28 for monthly
  time_of_day   TIME NOT NULL,
  recipients    JSONB NOT NULL,                       -- [{ userId, email }]
  export_format VARCHAR(10) DEFAULT 'pdf',
  is_active     BOOLEAN DEFAULT true,
  last_run_at   TIMESTAMP,
  next_run_at   TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_SCHEDULE_NEXT_RUN, IDX_SCHEDULE_ORG

-- TABLE: report_executions
CREATE TABLE report_executions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  report_id     UUID NOT NULL REFERENCES report_definitions(id),
  status        VARCHAR(20) DEFAULT 'pending',        -- pending, running, completed, failed
  parameters    JSONB,                                -- runtime parameters (date range, filters)
  result_url    TEXT,                                  -- S3/storage URL for generated file
  row_count     INT,
  started_at    TIMESTAMP,
  completed_at  TIMESTAMP,
  error_message TEXT,
  triggered_by  VARCHAR(20) DEFAULT 'user',           -- user, schedule, system
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_EXECUTION_ORG_REPORT, IDX_EXECUTION_STATUS

-- TABLE: dashboard_widgets
CREATE TABLE dashboard_widgets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL,
  user_id       UUID,                                 -- NULL = org-level default
  name          VARCHAR(100) NOT NULL,
  type          VARCHAR(50) NOT NULL,                 -- counter, bar_chart, line_chart, pie_chart, table
  data_source   VARCHAR(50) NOT NULL,                 -- expense, payroll, invoice, workflow
  config        JSONB NOT NULL,                       -- query config, filters, aggregation
  position      JSONB DEFAULT '{}',                   -- grid position { x, y, w, h }
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indexes: IDX_WIDGET_ORG_USER

-- ===== MATERIALIZED/AGGREGATION TABLES (populated by Kafka events) =====

-- TABLE: fact_expenses (denormalized for reporting)
CREATE TABLE fact_expenses (
  id            UUID PRIMARY KEY,
  org_id        UUID NOT NULL,                        -- INDEX (partition key)
  user_id       UUID NOT NULL,
  category_id   UUID,
  category_name VARCHAR(100),
  amount        DECIMAL(15,2) NOT NULL,
  currency      VARCHAR(3),
  status        VARCHAR(30),
  expense_date  DATE NOT NULL,                        -- INDEX
  approved_at   TIMESTAMP,
  created_at    TIMESTAMP
);
-- Indexes: IDX_FACT_EXP_ORG_DATE, IDX_FACT_EXP_ORG_USER, IDX_FACT_EXP_ORG_CAT
-- Consider partitioning by org_id or date

-- TABLE: fact_payroll (denormalized for reporting)
CREATE TABLE fact_payroll (
  id            UUID PRIMARY KEY,
  org_id        UUID NOT NULL,
  user_id       UUID NOT NULL,
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  gross_salary  DECIMAL(15,2),
  net_salary    DECIMAL(15,2),
  total_tax     DECIMAL(15,2),
  reimbursements DECIMAL(15,2),
  created_at    TIMESTAMP
);
-- Indexes: IDX_FACT_PAY_ORG_PERIOD, IDX_FACT_PAY_ORG_USER

-- TABLE: fact_invoices (denormalized for reporting)
CREATE TABLE fact_invoices (
  id            UUID PRIMARY KEY,
  org_id        UUID NOT NULL,
  customer_id   UUID,
  customer_name VARCHAR(255),
  total_amount  DECIMAL(15,2),
  amount_paid   DECIMAL(15,2),
  status        VARCHAR(30),
  issue_date    DATE NOT NULL,
  due_date      DATE,
  paid_at       TIMESTAMP,
  currency      VARCHAR(3),
  created_at    TIMESTAMP
);
-- Indexes: IDX_FACT_INV_ORG_DATE, IDX_FACT_INV_ORG_STATUS
```

### 4. Architecture Decision

**Why separate:** Reporting has fundamentally different access patterns (read-heavy, complex aggregations, large scans) compared to OLTP services. It maintains denormalized/materialized views, can use read replicas, and its queries should never impact transactional service performance.

**Communication:**
- Reporting ← All Services: **Async (Kafka consumer)** — ingests events into fact tables
- Reporting → Notification: **Async (Kafka: `report.generated`)** for scheduled report delivery
- Reporting → User Management: **Sync REST** (resolve user names for reports)

**Kafka Topics Consumed:**
- `expense.created`, `expense.status.changed`
- `payroll.run.completed`, `payroll.payslip.generated`
- `invoice.created`, `invoice.paid`, `invoice.overdue`
- `workflow.instance.completed`

### 5. API Design

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/v1/reports | List report definitions |
| POST | /api/v1/reports | Create custom report |
| GET | /api/v1/reports/:id | Get report definition |
| PATCH | /api/v1/reports/:id | Update report |
| POST | /api/v1/reports/:id/execute | Trigger report execution |
| GET | /api/v1/reports/:id/executions | List past executions |
| GET | /api/v1/reports/executions/:id | Get execution result/download |
| GET | /api/v1/dashboards/widgets | Get dashboard widgets |
| POST | /api/v1/dashboards/widgets | Create widget |
| PATCH | /api/v1/dashboards/widgets/:id | Update widget |
| DELETE | /api/v1/dashboards/widgets/:id | Remove widget |
| GET | /api/v1/dashboards/data/:widgetId | Get widget data |
| GET | /api/v1/schedules | List report schedules |
| POST | /api/v1/schedules | Create schedule |
| PATCH | /api/v1/schedules/:id | Update schedule |
| DELETE | /api/v1/schedules/:id | Delete schedule |

### 6. Reliability & Consistency

- **Idempotency:** Event ingestion uses event ID as dedup key (upsert into fact tables).
- **Eventual consistency:** Reporting data may lag 1-5 minutes behind source services (acceptable for analytics).
- **Fault tolerance:** If Kafka consumer falls behind, backpressure handling with batch processing. DLQ for unparseable events.
- **Data freshness:** Dashboard counters can use Redis counters (updated in real-time via events) while detailed reports use DB.

### 7. Caching (Redis)

| Data | Key Pattern | TTL | Invalidation |
|------|-------------|-----|--------------|
| Dashboard widget data | `org:{orgId}:dashboard:{widgetId}:data` | 5min | Auto-expire + event-driven refresh |
| Report execution URL | `org:{orgId}:report:{executionId}:url` | 24hr | Immutable |
| Aggregate counters | `org:{orgId}:counter:{metric}:{period}` | 1min | Increment on event |

### 8. Integrations & Patterns

- **Strategy pattern:** Export format generation (PDF strategy, CSV strategy, Excel strategy)
- **Builder pattern:** Custom report query builder (assembles complex SQL from config)
- **Observer:** Event listener pattern for real-time dashboard counter updates
- **Third-party:** Cloud storage (S3) for generated report files, charting library for PDF charts
- **Cron:** Scheduled report execution (checks `report_schedules.next_run_at`), stale fact table cleanup

### 9. Operational Concerns

- Query timeout enforcement (30s max for dashboard queries, 5min for full reports)
- Tenant-scoped queries enforced at repository level (every query includes org_id filter)
- Large report generation runs as background job with progress tracking

### 10. AI/RAG Opportunities

- **Natural language queries:** "Show me total expenses by category for last quarter" → SQL generation
- **Anomaly detection:** Highlight unusual spending patterns or revenue changes
- **Predictive analytics:** Forecast expenses, revenue based on historical data
- **Smart dashboards:** Auto-suggest relevant widgets based on user role and activity

---

## CROSS-SERVICE ARCHITECTURE

### Service Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY (:3000)                             │
│                    (Auth, Rate Limiting, Routing, CORS)                      │
└───────────┬─────────────┬──────────────┬──────────────┬────────────────────┘
            │             │              │              │
     ┌──────▼──────┐ ┌───▼────┐ ┌──────▼──────┐ ┌────▼─────┐
     │   User Mgmt │ │Expense │ │   Payroll   │ │ Invoice  │
     │   (:3001)   │ │(:3002) │ │   (:3003)   │ │ (:3005)  │
     └──────┬──────┘ └───┬────┘ └──────┬──────┘ └────┬─────┘
            │             │              │              │
            │      ┌──────▼──────┐       │             │
            │      │  Workflow   │       │             │
            │      │  (:3004)   │◄──────────────────────┘
            │      └──────┬──────┘       │
            │             │              │
            │      ┌──────▼──────────────▼─────────────────────┐
            │      │              KAFKA / SQS                    │
            │      │  Topics: expense.*, payroll.*, invoice.*,  │
            │      │  workflow.*, user.*, notification.*         │
            └──────►──────────────┬────────────────────────────┘
                                  │
                   ┌──────────────▼──────────────┐
                   │       Notification (:3006)   │
                   │  (Email, SMS, Push, In-App)  │
                   └──────────────────────────────┘
                                  │
                   ┌──────────────▼──────────────┐
                   │       Reporting (:3007)      │
                   │  (Analytics, Dashboards)     │
                   └─────────────────────────────┘
```

### Communication Matrix

| From → To | Style | Protocol | Topic/Endpoint | Purpose |
|-----------|-------|----------|----------------|---------|
| All → User Mgmt | Sync | REST | `GET /internal/users/:id` | Resolve user details |
| All → User Mgmt | Sync | REST | `POST /internal/validate-token` | Token validation |
| Expense → Workflow | Sync | REST | `POST /instances` | Trigger approval workflow |
| Expense → Payroll | Async | Kafka | `expense.reimbursement.approved` | Trigger reimbursement |
| Expense → Notification | Async | Kafka | `expense.status.changed` | Status notification |
| Payroll → Notification | Async | Kafka | `payroll.payslip.generated` | Payslip ready |
| Payroll → Reporting | Async | Kafka | `payroll.run.completed` | Analytics ingestion |
| Invoice → Workflow | Sync | REST | `POST /instances` | Approval for high-value |
| Invoice → Notification | Async | Kafka | `invoice.sent`, `invoice.overdue` | Notifications |
| Invoice → Reporting | Async | Kafka | `invoice.created`, `invoice.paid` | Revenue analytics |
| Workflow → Notification | Async | Kafka | `workflow.step.pending` | Approval requests |
| Workflow → Expense/Invoice | Async | Kafka | `workflow.instance.completed` | Update entity status |
| User Mgmt → Notification | Async | Kafka | `user.created`, `password.reset` | Welcome/reset emails |
| Reporting → Notification | Async | Kafka | `report.generated` | Scheduled report delivery |

### Sync vs Async Decision Rationale

| Interaction | Decision | Reasoning |
|-------------|----------|-----------|
| Token validation | Sync REST | Critical path, low latency required, must block |
| User lookup | Sync REST | Needed for immediate response rendering |
| Workflow trigger | Sync REST | Caller needs workflow instance ID immediately |
| Reimbursement to Payroll | Async Kafka | Not time-critical, eventual consistency OK |
| Notifications | Async Kafka | Fire-and-forget, decoupled from business logic |
| Reporting ingestion | Async Kafka | Near-real-time acceptable, no back-pressure |

---

## SHARED MONOREPO LIBRARY (`shared/`)

```
shared/
├── src/
│   ├── constants/
│   │   ├── roles.enum.ts          → RoleEnum (super_admin, org_admin, manager, employee, viewer)
│   │   ├── permissions.enum.ts    → PermissionEnum (module:action format)
│   │   └── service-tokens.ts      → Service names and internal endpoint paths
│   ├── decorators/
│   │   ├── current-user.decorator.ts   → @CurrentUser() extracts user from request
│   │   ├── org-id.decorator.ts         → @OrgId() extracts org context
│   │   ├── roles.decorator.ts          → @RequireRoles(...roles)
│   │   ├── permissions.decorator.ts    → @RequirePermissions(...perms)
│   │   └── public.decorator.ts         → @Public() skips auth
│   ├── guards/
│   │   ├── jwt-auth.guard.ts           → Base JWT guard (checks @Public)
│   │   ├── roles.guard.ts             → Validates user role
│   │   ├── permissions.guard.ts       → Validates user permissions
│   │   ├── tenant-isolation.guard.ts  → Prevents cross-tenant access
│   │   └── service-auth.guard.ts      → Validates x-service-api-key
│   ├── interceptors/
│   │   └── response-transform.interceptor.ts → Standard { success, data, meta } wrapper
│   ├── dto/
│   │   └── pagination-query.dto.ts    → Base pagination (page, limit) DTO
│   ├── interfaces/
│   │   ├── authenticated-user.interface.ts  → IAuthenticatedUser
│   │   ├── jwt-payload.interface.ts         → IJwtPayload
│   │   ├── pagination.interface.ts          → IPaginationOptions, IPaginatedResult
│   │   └── service-response.interface.ts    → IServiceResponse
│   ├── utils/
│   │   └── idempotency.ts            → Idempotency key generation helpers
│   └── index.ts                       → Barrel exports
├── package.json
└── tsconfig.json
```

### Event Contracts (shared across services)

```typescript
// shared/src/events/expense.events.ts
interface ExpenseReimbursementApprovedEvent {
  eventId: string;
  orgId: string;
  userId: string;
  expenseReportId: string;
  amount: number;
  currency: string;
  approvedBy: string;
  approvedAt: string;
}

// shared/src/events/payroll.events.ts
interface PayslipGeneratedEvent {
  eventId: string;
  orgId: string;
  userId: string;
  payslipId: string;
  period: { start: string; end: string };
  netSalary: number;
}

// shared/src/events/workflow.events.ts
interface WorkflowInstanceCompletedEvent {
  eventId: string;
  orgId: string;
  instanceId: string;
  triggerEntityType: string;
  triggerEntityId: string;
  outcome: 'approved' | 'rejected';
  completedBy: string;
}

// shared/src/events/invoice.events.ts
interface InvoiceSentEvent {
  eventId: string;
  orgId: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  totalAmount: number;
  dueDate: string;
}
```

---

## API GATEWAY DESIGN

### Architecture

```
┌────────────────────────────────────────────────────────┐
│                  API GATEWAY (:3000)                    │
├────────────────────────────────────────────────────────┤
│  Layer 1: CORS + Security Headers                      │
│  Layer 2: Rate Limiting (per IP, per user, per org)    │
│  Layer 3: JWT Validation (call User Mgmt /validate)    │
│  Layer 4: Route Matching + Proxy                       │
│  Layer 5: Response Transformation                      │
└────────────────────────────────────────────────────────┘
```

### Routing Table

| Path Pattern | Target Service | Port |
|-------------|----------------|------|
| `/api/v1/auth/**` | users-management | 3001 |
| `/api/v1/users/**` | users-management | 3001 |
| `/api/v1/organizations/**` | users-management | 3001 |
| `/api/v1/roles/**` | users-management | 3001 |
| `/api/v1/permissions/**` | users-management | 3001 |
| `/api/v1/expenses/**` | expense-management | 3002 |
| `/api/v1/categories/**` | expense-management | 3002 |
| `/api/v1/expense-reports/**` | expense-management | 3002 |
| `/api/v1/expense-policies/**` | expense-management | 3002 |
| `/api/v1/salary-structures/**` | payroll | 3003 |
| `/api/v1/payroll-cycles/**` | payroll | 3003 |
| `/api/v1/payroll-runs/**` | payroll | 3003 |
| `/api/v1/payslips/**` | payroll | 3003 |
| `/api/v1/workflows/**` | workflow | 3004 |
| `/api/v1/workflow-templates/**` | workflow | 3004 |
| `/api/v1/invoices/**` | invoice-management | 3005 |
| `/api/v1/customers/**` | invoice-management | 3005 |
| `/api/v1/recurring-invoices/**` | invoice-management | 3005 |
| `/api/v1/notifications/**` | notification | 3006 |
| `/api/v1/reports/**` | reporting | 3007 |
| `/api/v1/dashboards/**` | reporting | 3007 |

### Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| Per IP (unauthenticated) | 30 req | 1 min |
| Per User | 300 req | 1 min |
| Per Org | 3000 req | 1 min |
| Auth endpoints | 10 req | 1 min |

### Gateway Features

- **JWT validation:** Validates token signature, extracts user context, attaches to proxied request headers (`x-user-id`, `x-org-id`, `x-role`, `x-permissions`)
- **Request ID:** Generates UUID correlation ID (`x-correlation-id`) if not present, propagates to all downstream services
- **Health aggregation:** `/health` endpoint aggregates health from all services
- **Circuit breaker:** Per-service circuit breaker (if service returns 5xx consistently, gateway returns 503)
- **Request/Response logging:** Structured access logs with timing, user, and org context

---

## DEPLOYMENT & INFRASTRUCTURE NOTES

### Database Strategy
- Each service has its own PostgreSQL database (physical isolation)
- Shared database server in development (logical databases)
- Production: separate RDS instances per service for fault isolation

### Redis
- Single Redis cluster shared across services (different key prefixes)
- Production: Redis Cluster with read replicas

### Kafka
- Single Kafka cluster with topics per service domain
- Partition key: `org_id` (ensures ordering within tenant)
- Consumer groups: one per consuming service

### Container Orchestration
- Each service is a Docker container
- Kubernetes deployment with:
  - HPA (Horizontal Pod Autoscaler) per service
  - Resource limits and requests
  - Liveness and readiness probes on `/health`

---

## SUMMARY OF DESIGN PATTERNS USED

| Pattern | Where Used | Purpose |
|---------|-----------|---------|
| **Strategy** | Tax calculation, Policy validation, Approver resolution, Notification channel, Export format | Swap algorithms without changing client code |
| **Factory** | Notification channel factory, Disbursement handler, PDF template, Receipt processor | Encapsulate object creation logic |
| **Repository** | All services | Abstract data access, enable testing |
| **Observer/Event** | Workflow state changes, Expense approvals, Invoice payments | Decouple producers from consumers |
| **State Machine** | Workflow instances, Expense status, Invoice status | Enforce valid state transitions |
| **Template Method** | Base notification processor, Report generator | Define algorithm skeleton, defer steps |
| **Builder** | Custom report query builder, Payslip PDF builder | Construct complex objects step by step |
| **Decorator** | Invoice line item calculations (price → discount → tax) | Add behavior dynamically |
| **Saga** | Expense approval → Payroll reimbursement, Invoice → Payment | Distributed transaction coordination |
| **Circuit Breaker** | All service-to-service REST calls, External API calls | Fault tolerance |
| **Optimistic Locking** | User updates, Expense reports, Invoices | Concurrency control |
| **Pessimistic Locking** | Payroll runs, Invoice numbering | Sequential/exclusive operations |
