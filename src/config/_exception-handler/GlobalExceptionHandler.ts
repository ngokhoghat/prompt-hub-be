import { InternalServerErrorException } from "@nestjs/common";

export class GlobalExceptionHandler extends InternalServerErrorException {
    constructor() {
        super();
    }
}