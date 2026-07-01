import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the organization ID from the authenticated user context.
 * Usage: @OrgId() orgId: string
 */
export const OrgId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.orgId;
  },
);
