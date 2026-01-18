import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Prompt } from './entities/prompt.entity';
import { In, Repository, Brackets } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';

@Injectable()
export class PromptService implements OnModuleInit {
    constructor(
        @InjectRepository(Prompt)
        private promptRepository: Repository<Prompt>,
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ) { }

    async onModuleInit() {
        try {
            // Fix for "Unexpected end of JSON input" error caused by empty string in json column
            const tableName = this.promptRepository.metadata.tableName;
            await this.promptRepository.query(`UPDATE \`${tableName}\` SET show_cases = NULL WHERE show_cases = ''`);
        } catch (e) {
            console.warn('Failed to sanitize show_cases:', e);
        }
    }

    async create(createPromptDto: CreatePromptDto) {
        const { tagIds, ...promptData } = createPromptDto;

        if (!promptData.slug) {
            promptData.slug = await this.createUniqueSlug(promptData.title);
        }

        const prompt = this.promptRepository.create(promptData);

        if (tagIds && tagIds.length > 0) {
            const tags = await this.tagRepository.findBy({ id: In(tagIds) });
            prompt.tags = tags;
        }

        return await this.promptRepository.save(prompt);
    }

    async findAll(search?: string, categoryId?: string, modelId?: string, page: number = 1, limit: number = 10) {
        const queryBuilder = this.promptRepository.createQueryBuilder('prompt')
            .leftJoinAndSelect('prompt.tags', 'tags')
            .leftJoinAndSelect('prompt.aiModel', 'aiModel')
            .leftJoinAndSelect('prompt.category', 'category');

        if (search) {
            queryBuilder.where(
                'MATCH(prompt.title, prompt.description, prompt.content) AGAINST (:search IN BOOLEAN MODE)',
                { search: `${search}*` }
            );
        }

        if (categoryId) {
            const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(categoryId);
            let categoryExists = false;

            // Check if category exists before applying filter
            // We can check using count
            const categoryRepo = this.promptRepository.manager.getRepository('Category');
            const count = await categoryRepo.count({
                where: isUUID ? { id: categoryId } : { slug: categoryId }
            });
            categoryExists = count > 0;

            if (categoryExists) {
                if (isUUID) {
                    queryBuilder.andWhere('category.id = :categoryId', { categoryId });
                } else {
                    queryBuilder.andWhere('category.slug = :categoryId', { categoryId });
                }
            }
        }

        if (modelId) {
            const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(modelId);
            let modelExists = false;

            const modelRepo = this.promptRepository.manager.getRepository('AIModel');
            const count = await modelRepo.count({
                where: isUUID ? { id: modelId } : { slug: modelId }
            });
            modelExists = count > 0;

            if (modelExists) {
                if (isUUID) {
                    queryBuilder.andWhere('aiModel.id = :modelId', { modelId });
                } else {
                    queryBuilder.andWhere('aiModel.slug = :modelId', { modelId });
                }
            }
        }

        queryBuilder.skip((page - 1) * limit).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findSimilar(id: string, limit: number = 4) {
        const prompt = await this.findOne(id);
        const queryBuilder = this.promptRepository.createQueryBuilder('prompt')
            .leftJoinAndSelect('prompt.tags', 'tags')
            .leftJoinAndSelect('prompt.category', 'category')
            .leftJoinAndSelect('prompt.aiModel', 'aiModel') // Select aiModel as well for card display
            .where('prompt.id != :id', { id });

        // Logic: Same category OR Same tags
        let hasCondition = false;

        if (prompt.category) {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where('category.id = :categoryId', { categoryId: prompt.category.id });

                    if (prompt.tags && prompt.tags.length > 0) {
                        const tagIds = prompt.tags.map(t => t.id);
                        qb.orWhere('tags.id IN (:...tagIds)', { tagIds });
                    }
                })
            );
            hasCondition = true;
        } else if (prompt.tags && prompt.tags.length > 0) {
            const tagIds = prompt.tags.map(t => t.id);
            queryBuilder.andWhere('tags.id IN (:...tagIds)', { tagIds });
            hasCondition = true;
        }

        // If no category and no tags, maybe return random or trending? 
        // For now, if no conditions, it might return everything excluding itself if we don't return early.
        // Let's fallback to returning recent prompts if nothing matches?
        // Or just allow standard query which implies "any" if we didn't add brackets.

        if (!hasCondition) {
            // Fallback: just return latest
        }

        queryBuilder.orderBy('prompt.createdAt', 'DESC').take(limit);

        // We need to return the data format expected by frontend. 
        // Frontend expects: { data: [...] } usually from our response wrapper, but service returns entity array.
        // The controller usually wrapping is implicit or explicit. 
        // Existing findAll returns { data, meta }. 
        // findSimilar can just return { data: result }

        const result = await queryBuilder.getMany();

        return { data: result };
    }

    async findOne(identifier: string) {
        const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);

        const whereCondition = isUUID ? { id: identifier } : { slug: identifier };

        const prompt = await this.promptRepository.findOne({
            where: whereCondition,
            relations: ['tags', 'aiModel', 'category'],
        });

        if (!prompt) {
            throw new NotFoundException(`Prompt with ID/Slug ${identifier} not found`);
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

    private generateSlug(title: string): string {
        return title
            .toString()
            .normalize('NFD') // Change diacritics
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    }

    async createUniqueSlug(title: string): Promise<string> {
        let slug = this.generateSlug(title);
        let uniqueSlug = slug;
        let counter = 1;

        while (await this.promptRepository.findOne({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        return uniqueSlug;
    }
}
