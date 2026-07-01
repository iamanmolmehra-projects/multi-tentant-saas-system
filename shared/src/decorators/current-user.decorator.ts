import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * Extracts the authenticated user from request context.
 * Usage: @CurrentUser() user: IAuthenticatedUser
 */
export const CurrentUser = createParamDecorator(
  (data: keyof IAuthenticatedUser | undefined, ctx: ExecutionContext): IAuthenticatedUser | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IAuthenticatedUser;

    if (data) {
      return user[data];
    }

    return user;
  },
);
