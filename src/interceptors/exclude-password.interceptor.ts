import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class ExcludePasswordInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          if (Array.isArray(data)) {
            return data.map((item) => this.excludePassword(item));
          }
          return this.excludePassword(data);
        }),
      );
    }
  
    private excludePassword(data: any) {
      if (data && typeof data === 'object' && 'password' in data) {
        const { password, ...rest } = data;
        return rest;
      }
      return data;
    }
  }
  