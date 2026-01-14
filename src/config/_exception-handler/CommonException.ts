import { HttpException, HttpStatus } from "@nestjs/common";

export class CommonException extends HttpException {
    constructor(supper) {
        super('Message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}