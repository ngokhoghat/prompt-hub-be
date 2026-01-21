import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from '../prompt/entities/prompt.entity';


@Injectable()
export class TrendingService {
    private readonly logger = new Logger(TrendingService.name);

    constructor(
        @InjectRepository(Prompt)
        private promptRepository: Repository<Prompt>,
    ) { }

    @Cron('0 */30 * * * *') // Every 30 minutes
    async calculateTrending() {
        this.logger.log('Starting trending score calculation...');

        const query = `
            UPDATE prompt p
            LEFT JOIN (
                SELECT prompt_id, COUNT(*) as count 
                FROM prompt_view 
                WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR) 
                GROUP BY prompt_id
            ) v ON p.id = v.prompt_id
            LEFT JOIN (
                SELECT prompt_id, COUNT(*) as count 
                FROM prompt_like 
                WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR) 
                GROUP BY prompt_id
            ) l ON p.id = l.prompt_id
            LEFT JOIN (
                SELECT prompt_id, COUNT(*) as count 
                FROM prompt_save 
                WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR) 
                GROUP BY prompt_id
            ) s ON p.id = s.prompt_id
            SET p.trending_score = (COALESCE(v.count, 0) * 1) + (COALESCE(l.count, 0) * 5) + (COALESCE(s.count, 0) * 10);
        `;

        await this.promptRepository.query(query);

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
