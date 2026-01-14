import { IsNotEmpty } from "class-validator";

export class LoginFormDto {
    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    password: string;

    ipAddress: string | undefined;
}
