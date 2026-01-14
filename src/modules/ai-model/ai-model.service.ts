import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAIModelDto } from './dto/create-ai-model.dto';
import { UpdateAIModelDto } from './dto/update-ai-model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AIModel } from './entities/ai-model.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AIModelService {
    constructor(
        @InjectRepository(AIModel)
        private aiModelRepository: Repository<AIModel>,
    ) { }

    async create(createAIModelDto: CreateAIModelDto) {
        const aiModel = this.aiModelRepository.create(createAIModelDto);
        return await this.aiModelRepository.save(aiModel);
    }

    async findAll() {
        return await this.aiModelRepository.find();
    }

    async findOne(id: string) {
        const aiModel = await this.aiModelRepository.findOneBy({ id });
        if (!aiModel) {
            throw new NotFoundException(`AIModel with ID ${id} not found`);
        }
        return aiModel;
    }

    async update(id: string, updateAIModelDto: UpdateAIModelDto) {
        const aiModel = await this.findOne(id);
        Object.assign(aiModel, updateAIModelDto);
        return await this.aiModelRepository.save(aiModel);
    }

    async remove(id: string) {
        const aiModel = await this.findOne(id);
        return await this.aiModelRepository.remove(aiModel);
    }
}
