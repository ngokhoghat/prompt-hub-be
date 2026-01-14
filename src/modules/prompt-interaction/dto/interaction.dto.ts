import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class InteractionDto {
    @IsNotEmpty()
    @IsString()
    promptId: string;

    @IsOptional()
    @IsString()
    userId: string; // Temporarily allow passing userId manually for testing
}
