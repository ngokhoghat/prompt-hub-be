import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterForm {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email address is not valid.' })
    email: string;

    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    password: string;
}