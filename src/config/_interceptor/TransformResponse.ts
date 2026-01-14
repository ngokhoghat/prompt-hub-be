import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import ResponseEntityBuilder from '../_models/response/common/ResponseEntityBuilder';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => ResponseEntityBuilder
                .getBuilder()
                .setData(data)
                .build()
            ),
        );
    }
}