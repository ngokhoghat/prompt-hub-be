import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "../upload/entities/file.entity";
import { AccessLog } from "../upload/entities/accessLog.entity";

@Injectable()
export class FileStorageService {
    constructor(
        @InjectRepository(File) private fileRepo: Repository<File>,
        @InjectRepository(AccessLog) private accessLogRepo: Repository<AccessLog>,
    ) { }

    getAllFiles() {
        return this.fileRepo.find({ where: { isDelete: false }, order: { createdAt: "DESC" } });
    }
}