import { Controller, Get } from "@nestjs/common";
import { FileStorageService } from "./file-storage.service";
import { Permissions } from "../_decorators/permissions.decorator";

@Controller('file-storage')
export class FileStorageController {
    constructor(private fileStorageService: FileStorageService) { }

    @Get('get-all-files')
    @Permissions('file:get-all-files')
    getAllFiles() {
        return this.fileStorageService.getAllFiles();
    }
}