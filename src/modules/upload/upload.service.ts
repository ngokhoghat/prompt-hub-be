import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegPath from 'ffmpeg-static';
import { In, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isArrayEmpty } from 'src/utils/validations';
import { ActiveFileDto } from './dto/active-file.dto';
import { AccessLog } from './entities/accessLog.entity';
import getAudioDurationInSeconds from 'get-audio-duration';
import { SliceAudioFileDto } from './dto/slice-audio-form.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getFileInformation, moveFile, unlinkFileAsync } from 'src/utils/fileConfig';
import { createReadStream } from 'fs';
import { Response } from 'express';
ffmpeg.setFfmpegPath(ffmpegPath);
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File) private fileRepo: Repository<File>,
    @InjectRepository(AccessLog) private accessLogRepo: Repository<AccessLog>,
  ) { }

  async uploadFile(files: Array<Express.Multer.File>) {
    if (isArrayEmpty(files)) throw new BadRequestException('File is not uploaded');
    const listFile = files.map(item => Object.assign(new File(), {
      filePath: item.path,
      fileName: item.filename,
      fileType: item.mimetype,
      fileSize: item.size
    }));



    const fileSaveResult = await this.fileRepo.save(listFile);
    await this.accessLogRepo.save(fileSaveResult.map(file =>
      Object.assign(new AccessLog(), {
        accessTime: new Date(),
        accessType: "C",
        fileId: file.id
      }))
    )

    return fileSaveResult;
  }

  async activeFile(activeFileDto: ActiveFileDto) {
    const targetFiles = await this.fileRepo.find({ where: { id: In(activeFileDto.fileIds) } });
    if (isArrayEmpty(targetFiles)) throw new BadRequestException('Find not found');

    const newFiles: Array<File> = [];
    const accessLogs: Array<AccessLog> = [];

    for await (const file of targetFiles) {
      const { msg, success, filePath } = await moveFile(file.filePath);

      accessLogs.push(Object.assign(new AccessLog(), {
        accessTime: new Date(),
        accessType: "M",
        accessLog: success ? "" : msg,
        fileId: file.id
      }));

      if (success) {
        newFiles.push(Object.assign(new File(), {
          ...file,
          filePath: filePath
        }))
      }
    }

    await this.accessLogRepo.save(accessLogs);
    return this.fileRepo.save(newFiles);
  }

  async sliceAudioFile(sliceAudioFileForm: SliceAudioFileDto) {
    const targetFile = await this.fileRepo.findOneBy({ id: sliceAudioFileForm.fileId });
    if (!targetFile) throw new BadRequestException('File not found');
    if (!targetFile.fileType.includes("audio")) throw new BadRequestException('File format invalid');
    const totalDuration = await getAudioDurationInSeconds(targetFile.filePath);
    const startSeconds = this.timeToSeconds(sliceAudioFileForm.startTime);
    const endSeconds = this.timeToSeconds(sliceAudioFileForm.endTime);

    if (startSeconds < 0 || startSeconds >= totalDuration || endSeconds < 0 || endSeconds > totalDuration) {
      throw new BadRequestException('Start time or End time invalid.');
    }
    const outputPath: any = await this.sliceAudio(targetFile, sliceAudioFileForm);
    const file = getFileInformation(outputPath);

    let newFiles: File = Object.assign(new File(), {
      fileName: file.fileName,
      filePath: outputPath,
      fileSize: file.fileSize,
      fileType: file.fileMimeType
    })

    const fileSaveResult = await this.fileRepo.save(newFiles);

    await this.accessLogRepo.save(Object.assign(new AccessLog(), {
      accessTime: new Date(),
      accessType: "C",
      fileId: fileSaveResult.id
    }))

    return fileSaveResult;
  }

  async getFile(id: string, res: Response) {
    try {
      const targetFile = await this.fileRepo.findOneBy({ id });
      if (!targetFile) throw new BadRequestException("File not found!");
      if (targetFile.fileType.includes("audio")) this.sendAudioFile(targetFile, res);
      else if (targetFile.fileType.includes("image")) this.sendImageFile(targetFile, res);
      else this.sendImageFile(targetFile, res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async handleDeleteTmpFile() {
    const listTmpFiles = await this.fileRepo
      .createQueryBuilder("f")
      .where("f.filePath LIKE :path", { path: 'public\\\\tmp%' })
      .getMany();

    const unlinkFiles: Array<File> = [];
    const accessLogs: Array<AccessLog> = [];

    for await (const file of listTmpFiles) {
      const { fileMtime } = getFileInformation(file.filePath);
      const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;

      if (fileMtime.getTime() < sixHoursAgo) {
        const { msg, success } = await unlinkFileAsync(file.filePath);
        accessLogs.push(Object.assign(new AccessLog(), {
          accessTime: new Date(),
          accessType: "D",
          accessLog: success ? "SUCCESS" : msg,
          fileId: file.id
        }));
        if (success) unlinkFiles.push(Object.assign(file));
      }
    }

    await this.accessLogRepo.save(accessLogs);
    await this.fileRepo.remove(unlinkFiles);
  }

  private sliceAudio(targetFile: File, sliceAudioFileForm: SliceAudioFileDto) {
    const startSeconds = this.timeToSeconds(sliceAudioFileForm.startTime);
    const endSeconds = this.timeToSeconds(sliceAudioFileForm.endTime);
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    const arrPath = targetFile.filePath.split("-");
    arrPath[1] = String(uniqueSuffix);
    const outputPath = arrPath.join("-").replace("uploads", "tmp");
    return new Promise((resolve, reject) => {
      ffmpeg(targetFile.filePath)
        .setStartTime(startSeconds)
        .setDuration(endSeconds - startSeconds)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run()
    })
  }

  private timeToSeconds(time: string): number {
    const parts = time.split(':');
    let seconds = 0;
    if (parts.length === 3) {
      seconds += parseInt(parts[0]) * 60 * 60;
      seconds += parseInt(parts[1]) * 60;
      seconds += parseInt(parts[2]);
    } else if (parts.length === 2) {
      seconds += parseInt(parts[0]) * 60;
      seconds += parseInt(parts[1]);
    } else if (parts.length === 1) {
      seconds += parseInt(parts[0]);
    }
    return seconds;
  }

  private sendAudioFile(file: File, res: Response) {
    const fileInfo = getFileInformation(file.filePath);
    const range = res.req.headers.range;
    if (!range) {
      res.writeHead(416, { 'Content-Range': `bytes */${fileInfo.fileSize}` });
      return res.end();
    }

    const CHUNK_SIZE = 1000 * 1e3; //  1MB chunk size
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, fileInfo.fileSize - 1);
    const fileStream = createReadStream(file.filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileInfo.fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'audio/mpeg',
      "Transfer-Encoding": "chunked",
    });
    fileStream.pipe(res);
  }

  private sendImageFile(file: File, res: Response) {
    createReadStream(file.filePath)
      .on('error', () => {
        res.writeHead(404);
        res.end();
      })
      .pipe(res);
  }
}