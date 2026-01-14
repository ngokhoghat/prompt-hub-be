import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';


// @Injectable()
// export class HttpInterceptor implements NestInterceptor {
//     constructor(private readonly httpService: HttpService) { }

//     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//         const request = context.switchToHttp().getRequest();
//         const authToken = request.headers['authorization'];
//         if (authToken) this.httpService.axiosRef.defaults.headers.common['Authorization'] = authToken;
//         return next.handle().pipe(tap((response) => response));
//     }
// }