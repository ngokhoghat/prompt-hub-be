import { Column, Entity } from "typeorm";
import { CustomBaseEntity } from "src/config/_common/entities/base.entity";

@Entity()
export class File extends CustomBaseEntity {
    @Column({ name: "file_name" })
    fileName: string;

    @Column({ name: "file_path" })
    filePath: string;

    @Column({ name: "file_type" })
    fileType: string;

    @Column({ name: "file_size" })
    fileSize: string;
}
