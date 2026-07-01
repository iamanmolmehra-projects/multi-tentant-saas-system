import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IServiceResponse } from '../interfaces/service-response.interface';

/**
 * Interceptor that wraps all responses in a standard format.
 */
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, IServiceResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IServiceResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        },
      })),
    );
  }
}
