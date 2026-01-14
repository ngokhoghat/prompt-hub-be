import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { UploadService } from "./upload.service";

@Injectable()
export class UploadJobService {
    constructor(private uploadService: UploadService) { }
    private readonly logger = new Logger(UploadJobService.name);

    // @Interval(10000)
    // @Cron('0 0 * * * *') // Xóa file mỗi 00:00 hàng ngày
    async handleCron() {
        await this.uploadService.handleDeleteTmpFile();
    }
}