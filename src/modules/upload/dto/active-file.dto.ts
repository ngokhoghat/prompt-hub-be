import { IsArray, IsNotEmpty } from "class-validator";

export class ActiveFileDto {
    @IsNotEmpty()
    @IsArray()
    fileIds: string[];
}