import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { AccessLog } from './entities/accessLog.entity';
import { UploadJobService } from './upload.job.service';

@Module({
  imports: [TypeOrmModule.forFeature([File, AccessLog])],
  controllers: [UploadController],
  providers: [UploadService, UploadJobService],
})
export class UploadModule { }
