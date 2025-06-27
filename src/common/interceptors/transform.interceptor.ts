import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // O next.handle() é o momento em que o controller é executado.
    // O .pipe(map(...)) acontece DEPOIS que a resposta do controller chega.
    return next.handle().pipe(map((data) => ({ data })));
  }
}