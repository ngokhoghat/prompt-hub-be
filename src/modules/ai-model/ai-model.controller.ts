import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AIModelService } from './ai-model.service';
import { CreateAIModelDto } from './dto/create-ai-model.dto';
import { UpdateAIModelDto } from './dto/update-ai-model.dto';

@Controller('ai-model')
export class AIModelController {
    constructor(private readonly aiModelService: AIModelService) { }

    @Post()
    create(@Body() createAIModelDto: CreateAIModelDto) {
        return this.aiModelService.create(createAIModelDto);
    }

    @Get()
    findAll() {
        return this.aiModelService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.aiModelService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAIModelDto: UpdateAIModelDto) {
        return this.aiModelService.update(id, updateAIModelDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.aiModelService.remove(id);
    }
}
