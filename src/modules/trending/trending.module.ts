import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrendingService } from './trending.service';
import { TrendingController } from './trending.controller';
import { Prompt } from '../prompt/entities/prompt.entity';
import { PromptLike } from '../prompt-interaction/entities/prompt-like.entity';
import { PromptView } from '../prompt-interaction/entities/prompt-view.entity';
import { PromptSave } from '../prompt-interaction/entities/prompt-save.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Prompt,
            PromptLike,
            PromptView,
            PromptSave
        ])
    ],
    controllers: [TrendingController],
    providers: [TrendingService],
})
export class TrendingModule { }
