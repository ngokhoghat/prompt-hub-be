import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ) { }

    async create(createTagDto: CreateTagDto) {
        const tag = this.tagRepository.create(createTagDto);
        return await this.tagRepository.save(tag);
    }

    async findAll() {
        return await this.tagRepository.find();
    }

    async findOne(id: string) {
        const tag = await this.tagRepository.findOneBy({ id });
        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }
        return tag;
    }

    async update(id: string, updateTagDto: UpdateTagDto) {
        const tag = await this.findOne(id);
        Object.assign(tag, updateTagDto);
        return await this.tagRepository.save(tag);
    }

    async remove(id: string) {
        const tag = await this.findOne(id);
        return await this.tagRepository.remove(tag);
    }
}
