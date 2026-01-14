import { ValidationException } from "./ValidationException";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import ResponseEntityBuilder from "src/config/_models/response/common/ResponseEntityBuilder";

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost) {
        const messages: String[] = [];

        exception.validationErrors.map((error) => {
            if (error && error.constraints)
                messages.push(Object.values(error.constraints)[0]);
            else if (error && error.children && error.children.length > 0)
                messages.push(`${error.property} has some errors.`);
        })

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