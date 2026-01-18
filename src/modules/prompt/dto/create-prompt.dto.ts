import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePromptDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsString({ each: true })
    tagIds: string[];

    @IsOptional()
    @IsBoolean()
    isPublic: boolean;

    @IsOptional()
    @IsBoolean()
    isFeature: boolean;

    @IsOptional()
    @IsString()
    aiModelId: string;

    @IsOptional()
    @IsString()
    categoryId: string;

    @IsOptional()
    @IsString({ each: true })
    showCases: string[];
}
