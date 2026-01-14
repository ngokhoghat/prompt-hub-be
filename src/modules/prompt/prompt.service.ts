import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Prompt } from './entities/prompt.entity';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';

@Injectable()
export class PromptService {
    constructor(
        @InjectRepository(Prompt)
        private promptRepository: Repository<Prompt>,
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ) { }

    async create(createPromptDto: CreatePromptDto) {
        const { tagIds, ...promptData } = createPromptDto;
        const prompt = this.promptRepository.create(promptData);

        if (tagIds && tagIds.length > 0) {
            const tags = await this.tagRepository.findBy({ id: In(tagIds) });
            prompt.tags = tags;
        }

        return await this.promptRepository.save(prompt);
    }

    async findAll(search?: string) {
        const queryBuilder = this.promptRepository.createQueryBuilder('prompt')
            .leftJoinAndSelect('prompt.tags', 'tags')
            .leftJoinAndSelect('prompt.aiModel', 'aiModel')
            .leftJoinAndSelect('prompt.category', 'category');

        if (search) {
            queryBuilder.where(
                'MATCH(prompt.title, prompt.description, prompt.content) AGAINST (:search IN NATURAL LANGUAGE MODE)',
                { search }
            );
        }

        return await queryBuilder.getMany();
    }

    async findOne(id: string) {
        const prompt = await this.promptRepository.findOne({
            where: { id },
            relations: ['tags', 'aiModel', 'category'],
        });
        if (!prompt) {
            throw new NotFoundException(`Prompt with ID ${id} not found`);
        }
        return prompt;
    }

    async update(id: string, updatePromptDto: UpdatePromptDto) {
        const { tagIds, ...promptData } = updatePromptDto;
        const prompt = await this.findOne(id);

        Object.assign(prompt, promptData);

        if (tagIds) {
            const tags = await this.tagRepository.findBy({ id: In(tagIds) });
            prompt.tags = tags;
        }

        return await this.promptRepository.save(prompt);
    }

    async remove(id: string) {
        const prompt = await this.findOne(id);
        return await this.promptRepository.remove(prompt);
    }
}
