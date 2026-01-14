import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "../upload/entities/file.entity";
import { FileStorageService } from "./file-storage.service";
import { AccessLog } from "../upload/entities/accessLog.entity";
import { FileStorageController } from "./file-storage.controller";

@Module({
    imports: [TypeOrmModule.forFeature([File, AccessLog])],
    controllers: [FileStorageController],
    providers: [FileStorageService],
})
export class FileStorageModule { }