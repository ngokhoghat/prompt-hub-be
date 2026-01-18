import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromptLike } from './entities/prompt-like.entity';
import { PromptSave } from './entities/prompt-save.entity';
import { PromptView } from './entities/prompt-view.entity';
import { InteractionDto } from './dto/interaction.dto';
import { Prompt } from '../prompt/entities/prompt.entity';

@Injectable()
export class PromptInteractionService {
    constructor(
        @InjectRepository(PromptLike)
        private likeRepository: Repository<PromptLike>,
        @InjectRepository(PromptSave)
        private saveRepository: Repository<PromptSave>,
        @InjectRepository(PromptView)
        private viewRepository: Repository<PromptView>,
        @InjectRepository(Prompt)
        private promptRepository: Repository<Prompt>,
    ) { }

    async toggleLike(dto: InteractionDto, ip: string) {
        const { promptId, userId } = dto;
        // Use IP for existence check if userId is not provided (or primarily use IP as requested)
        // Check identifying field: userId OR ip
        // Since request is to "use ip instead of userid", we prioritize IP or enforce IP.

        const exists = await this.likeRepository.findOneBy({ promptId, userIp: ip });

        if (exists) {
            await this.likeRepository.remove(exists);
            await this.promptRepository.decrement({ id: promptId }, 'likes', 1);
            return { message: 'Unliked', status: false };
        } else {
            const like = this.likeRepository.create({ promptId, userId, userIp: ip });
            await this.likeRepository.save(like);
            await this.promptRepository.increment({ id: promptId }, 'likes', 1);
            return { message: 'Liked', status: true };
        }
    }

    async toggleSave(dto: InteractionDto, ip: string) {
        const { promptId, userId } = dto;
        const exists = await this.saveRepository.findOneBy({ promptId, userIp: ip });
        if (exists) {
            await this.saveRepository.remove(exists);
            return { message: 'Unsaved', status: false };
        } else {
            const save = this.saveRepository.create({ promptId, userId, userIp: ip });
            await this.saveRepository.save(save);
            return { message: 'Saved', status: true };
        }
    }

    async recordView(dto: InteractionDto) {
        // Optionally check if user recently viewed to avoid spamming
        // For distinct views, we should check if this specific user/ip viewed recently.
        // For now, let's just record it.
        const view = this.viewRepository.create(dto);
        await this.viewRepository.save(view);
        await this.promptRepository.increment({ id: dto.promptId }, 'views', 1);
        return view;
    }

    async getStats(promptId: string) {
        const likes = await this.likeRepository.countBy({ promptId });
        const saves = await this.saveRepository.countBy({ promptId });
        const views = await this.viewRepository.countBy({ promptId });
        return { likes, saves, views };
    }
}
