import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prompt } from './entities/prompt.entity';
import { Tag } from '../tag/entities/tag.entity';
import { AIModel } from '../ai-model/entities/ai-model.entity';
import { Category } from '../category/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Prompt, Tag, AIModel, Category])],
    controllers: [PromptController],
    providers: [PromptService],
})
export class PromptModule { }
