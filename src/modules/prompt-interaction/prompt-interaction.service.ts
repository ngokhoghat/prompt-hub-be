import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromptLike } from './entities/prompt-like.entity';
import { PromptSave } from './entities/prompt-save.entity';
import { PromptView } from './entities/prompt-view.entity';
import { InteractionDto } from './dto/interaction.dto';

@Injectable()
export class PromptInteractionService {
    constructor(
        @InjectRepository(PromptLike)
        private likeRepository: Repository<PromptLike>,
        @InjectRepository(PromptSave)
        private saveRepository: Repository<PromptSave>,
        @InjectRepository(PromptView)
        private viewRepository: Repository<PromptView>,
    ) { }

    async toggleLike(dto: InteractionDto) {
        const { promptId, userId } = dto;
        const exists = await this.likeRepository.findOneBy({ promptId, userId });
        if (exists) {
            await this.likeRepository.remove(exists);
            return { message: 'Unliked', status: false };
        } else {
            const like = this.likeRepository.create({ promptId, userId });
            await this.likeRepository.save(like);
            return { message: 'Liked', status: true };
        }
    }

    async toggleSave(dto: InteractionDto) {
        const { promptId, userId } = dto;
        const exists = await this.saveRepository.findOneBy({ promptId, userId });
        if (exists) {
            await this.saveRepository.remove(exists);
            return { message: 'Unsaved', status: false };
        } else {
            const save = this.saveRepository.create({ promptId, userId });
            await this.saveRepository.save(save);
            return { message: 'Saved', status: true };
        }
    }

    async recordView(dto: InteractionDto) {
        // Optionally check if user recently viewed to avoid spamming
        const view = this.viewRepository.create(dto);
        return await this.viewRepository.save(view);
    }

    async getStats(promptId: string) {
        const likes = await this.likeRepository.countBy({ promptId });
        const saves = await this.saveRepository.countBy({ promptId });
        const views = await this.viewRepository.countBy({ promptId });
        return { likes, saves, views };
    }
}
