import { Request, Response } from 'express';
import { GlobalExceptionHandler } from './GlobalExceptionHandler';
import ResponseEntityBuilder from 'src/config/_models/response/common/ResponseEntityBuilder';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch(GlobalExceptionHandler)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception
      && exception.getStatus
      && exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(status)
      .json(ResponseEntityBuilder
        .getBuilder()
        .setCode(status)
        .setMessage(exception.message)
        .build());
  }
}