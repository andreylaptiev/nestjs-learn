import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface IClassConstructor {
  new (...args: any[]): {};
}

export const Serialize = (dto: IClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: IClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // this code runs for request interceptor (before handler)

    // code in return statement runs for response interceptor (after handler)
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
