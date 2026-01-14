import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptInteractionService } from './prompt-interaction.service';
import { PromptInteractionController } from './prompt-interaction.controller';
import { PromptLike } from './entities/prompt-like.entity';
import { PromptSave } from './entities/prompt-save.entity';
import { PromptView } from './entities/prompt-view.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PromptLike, PromptSave, PromptView])],
    controllers: [PromptInteractionController],
    providers: [PromptInteractionService],
})
export class PromptInteractionModule { }
