import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint({ async: true })
export class UniqueConstraint implements ValidatorConstraintInterface {
	async validate(value: any, args: ValidationArguments) {
		const entity = args.object[`class_entity_${args.property}`];
		return getManager()
			.count(entity, { [args.property]: value })
			.then((count) => count < 1);
	}
}

export function Unique(entity: Function, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		object[`class_entity_${propertyName}`] = entity;

		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: UniqueConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class UniqueIdConstraint implements ValidatorConstraintInterface {
	constructor() { }
	async validate(value: any, args: ValidationArguments) {
		const entity = args.object[`class_entity_${args.property}`];
		return getManager()
			.findOne(entity, value)
			.then((res) => res !== undefined);
	}
}

export function UniqueId(entity: Function, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		object[`class_entity_${propertyName}`] = entity;

		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: UniqueIdConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class UniqueOrderConstraint implements ValidatorConstraintInterface {
	constructor() { }
	async validate(value: any, args: ValidationArguments) {
		const entity = args.object[`class_entity_${args.property}`];
		return getManager()
			.findOne(entity, { order: value })
			.then((res) => res === undefined);
	}
}

export function UniqueOrder(entity: Function, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		object[`class_entity_${propertyName}`] = entity;

		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: UniqueOrderConstraint,
		});
	};
}

export function IsTimeFormat(validationOptions?: ValidationOptions) {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: 'isTimeFormat',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					if (typeof value !== 'string') return false;
					const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]$)/;
					return regex.test(value);
				},
				defaultMessage(args: ValidationArguments) {
					return `${propertyName} must be in the format "hh:mm:ss"`;
				},
			},
		});
	};
}

export function IsBefore(property: string, validationOptions?: ValidationOptions) {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: 'isBefore',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];

					if (!value || !relatedValue) return false; // Ensure both values are present

					const startTime = parseTime(value);
					const endTime = parseTime(relatedValue);

					return startTime < endTime;
				},
				defaultMessage(args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					return `${propertyName} must be before ${relatedPropertyName}`;
				},
			},
		});
	};
}

// Helper function to convert "hh:mm:ss" to seconds for comparison
function parseTime(time: string): number {
	const parts = time.split(':');
	const hours = parseInt(parts[0], 10);
	const minutes = parseInt(parts[1], 10);
	const seconds = parseInt(parts[2], 10);

	return hours * 3600 + minutes * 60 + seconds; // Convert to total seconds
}