import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAIModelDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    logoUrl: string;

    @IsNotEmpty()
    @IsString()
    provider: string;

    @IsOptional()
    @IsString()
    description: string;
}
