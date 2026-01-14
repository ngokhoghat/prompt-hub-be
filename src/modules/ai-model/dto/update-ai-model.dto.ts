import { PartialType } from '@nestjs/mapped-types';
import { CreateAIModelDto } from './create-ai-model.dto';

export class UpdateAIModelDto extends PartialType(CreateAIModelDto) { }
