import { IsNotEmpty } from "class-validator";

export class RefreshForm {
    @IsNotEmpty()
    refreshToken: string;
}