import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url, body } = context.getArgs()[0];
    let data: any = {};

    if (body) {
      const { password, ...rest } = body;

      data = {
        ...rest,
        method,
        url,
      };

      if (password) {
        data.password = '******';
      }
    }

    return next.handle().pipe(
      tap(() => this.logger.log(data)),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
