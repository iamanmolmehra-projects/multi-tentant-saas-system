import { createHash } from 'crypto';

/**
 * Generates an idempotency key from operation parameters.
 * Useful for ensuring operations are not duplicated.
 */
export function generateIdempotencyKey(
  ...params: (string | number | undefined)[]
): string {
  const input = params.filter(Boolean).join(':');
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Decorator-style helper for idempotent operations.
 * The caller should use this key as a DB unique constraint
 * or check existence before executing.
 */
export function buildIdempotencyToken(
  orgId: string,
  operation: string,
  entityId: string,
): string {
  return generateIdempotencyKey(orgId, operation, entityId);
}
