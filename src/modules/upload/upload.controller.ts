import { getStorage } from 'src/utils/fileConfig';
import { UploadService } from './upload.service';
import { ActiveFileDto } from './dto/active-file.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { SliceAudioFileDto } from './dto/slice-audio-form.dto';
import { Permissions } from '../_decorators/permissions.decorator';
import { Controller, Post, UseInterceptors, Body, UploadedFiles, Get, Param, Res } from '@nestjs/common';
import { Public } from '../_decorators/public.decorator';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) { }

  @Post()
  @Permissions("file:upload-file")
  @UseInterceptors(AnyFilesInterceptor({ storage: getStorage() }))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.uploadService.uploadFile(files);
  }

  @Post("active-file")
  @Permissions("file:active-file")
  activeFile(@Body() activeFileDto: ActiveFileDto) {
    return this.uploadService.activeFile(activeFileDto);
  }

  @Post("slice-audio-file")
  @Permissions("file:slice-audio-file")
  sliceAudioFile(@Body() sliceAudioFileForm: SliceAudioFileDto) {
    return this.uploadService.sliceAudioFile(sliceAudioFileForm);
  }

  @Get(":id")
  @Public()
  getFile(@Param("id") id: string, @Res() res) {
    return this.uploadService.getFile(id, res);
  }
}