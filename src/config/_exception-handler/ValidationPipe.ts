import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationException } from './ValidationException';

@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, metadata: any) {
        const object = plainToClass(metadata.metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }

        return value; // Return the validated and transformed value
    }
}