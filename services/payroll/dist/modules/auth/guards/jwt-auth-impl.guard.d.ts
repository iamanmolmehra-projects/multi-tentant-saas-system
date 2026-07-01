import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
declare const JwtAuthGuardImpl_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuardImpl extends JwtAuthGuardImpl_base {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = any>(err: Error | null, user: TUser): TUser;
}
export {};
