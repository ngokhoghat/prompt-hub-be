import { HttpException, HttpStatus, ValidationError } from "@nestjs/common";

export class ValidationException extends HttpException {
    constructor(public validationErrors: ValidationError[]) {
        const message = validationErrors.map(error => ({
            property: error.property,
            constraints: error.constraints
        }))
        super({ message }, HttpStatus.BAD_REQUEST);
    }
}