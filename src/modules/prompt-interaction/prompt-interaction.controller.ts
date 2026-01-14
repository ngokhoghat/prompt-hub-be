import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PromptInteractionService } from './prompt-interaction.service';
import { InteractionDto } from './dto/interaction.dto';

@Controller('interaction')
export class PromptInteractionController {
    constructor(private readonly interactionService: PromptInteractionService) { }

    @Post('like')
    toggleLike(@Body() dto: InteractionDto) {
        return this.interactionService.toggleLike(dto);
    }

    @Post('save')
    toggleSave(@Body() dto: InteractionDto) {
        return this.interactionService.toggleSave(dto);
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
