import { Module } from '@nestjs/common';
import { AIModelService } from './ai-model.service';
import { AIModelController } from './ai-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIModel } from './entities/ai-model.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AIModel])],
    controllers: [AIModelController],
    providers: [AIModelService],
})
export class AIModelModule { }
