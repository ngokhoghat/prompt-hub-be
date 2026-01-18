import { Controller, Post, Body, Get, Param, Ip } from '@nestjs/common';
import { PromptInteractionService } from './prompt-interaction.service';
import { InteractionDto } from './dto/interaction.dto';

@Controller('interaction')
export class PromptInteractionController {
    constructor(private readonly interactionService: PromptInteractionService) { }

    @Post('like')
    toggleLike(@Body() dto: InteractionDto, @Ip() ip: string) {
        return this.interactionService.toggleLike(dto, ip);
    }

    @Post('save')
    toggleSave(@Body() dto: InteractionDto, @Ip() ip: string) {
        return this.interactionService.toggleSave(dto, ip);
    }

    @Post('view')
    recordView(@Body() dto: InteractionDto) {
        return this.interactionService.recordView(dto);
    }

    @Get('stats/:promptId')
    getStats(@Param('promptId') promptId: string) {
        return this.interactionService.getStats(promptId);
    }
}
