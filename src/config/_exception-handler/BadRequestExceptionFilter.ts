import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import ResponseEntityBuilder from "src/config/_models/response/common/ResponseEntityBuilder";

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const messages = exception.message;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception
            && exception.getStatus
            && exception.getStatus() || HttpStatus.BAD_REQUEST;

        return response
            .status(status)
            .json(ResponseEntityBuilder
                .getBuilder()
                .setCode(status)
                .setMessage(messages)
                .build())
    }
}