import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from '../prompt/entities/prompt.entity';
import { PromptLike } from '../prompt-interaction/entities/prompt-like.entity';
import { PromptView } from '../prompt-interaction/entities/prompt-view.entity';
import { PromptSave } from '../prompt-interaction/entities/prompt-save.entity';

@Injectable()
export class TrendingService {
    private readonly logger = new Logger(TrendingService.name);

    constructor(
        @InjectRepository(Prompt)
        private promptRepository: Repository<Prompt>,
        @InjectRepository(PromptLike)
        private likeRepository: Repository<PromptLike>,
        @InjectRepository(PromptView)
        private viewRepository: Repository<PromptView>,
        @InjectRepository(PromptSave)
        private saveRepository: Repository<PromptSave>,
    ) { }

    @Cron('0 */30 * * * *') // Every 30 minutes
    async calculateTrending() {
        this.logger.log('Starting trending score calculation...');
        const prompts = await this.promptRepository.find();

        for (const prompt of prompts) {
            // Logic to calculate score based on recent interactions could be complex.
            // Simplified: (views * 1) + (likes * 5) + (saves * 10)
            // Ideally, filter by createdAt > 24 hours ago, but for simplicity using total counts + updates.
            // But requirement implies "updating", implying dynamic recent activity.
            // Let's stick to total counts for now as the entities don't have "interaction timestamps" easily querying just "recent" without complex joins or additional queries per prompt.
            // To make it better, we can query interactions created in last 24h.

            const last24h = new Date();
            last24h.setHours(last24h.getHours() - 24);

            const views = await this.viewRepository.createQueryBuilder('view')
                .where('view.promptId = :id', { id: prompt.id })
                .andWhere('view.createdAt > :date', { date: last24h })
                .getCount();

            const likes = await this.likeRepository.createQueryBuilder('like')
                .where('like.promptId = :id', { id: prompt.id })
                .andWhere('like.createdAt > :date', { date: last24h })
                .getCount();

            const saves = await this.saveRepository.createQueryBuilder('save')
                .where('save.promptId = :id', { id: prompt.id })
                .andWhere('save.createdAt > :date', { date: last24h })
                .getCount();

            const score = (views * 1) + (likes * 5) + (saves * 10);
            prompt.trendingScore = score;
            await this.promptRepository.save(prompt);
        }
        this.logger.log('Trending score calculation completed.');
        return { message: 'Calculation completed' };
    }

    async getTrending(limit: number = 10) {
        return await this.promptRepository.find({
            order: { trendingScore: 'DESC' },
            take: limit,
            relations: ['tags', 'aiModel', 'category'],
        });
    }
}
