import { CommonException } from "./CommonException";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import ResponseEntityBuilder from "src/config/_models/response/common/ResponseEntityBuilder";

@Catch(CommonException)
export class CommonExceptionFilter implements ExceptionFilter {
    catch(exception: CommonException, host: ArgumentsHost) {
        const messages: String[] = [];
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