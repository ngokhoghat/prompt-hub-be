import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AccessLog {
    @PrimaryGeneratedColumn({ name: "access_log_id" })
    accessLogId: number;

    @Column({ name: "file_id" })
    fileId: string;

    @Column({ name: "access_time" })
    accessTime: string;

    @Column({ name: "access_type" })
    accessType: string;

    @Column({ name: "access_log", nullable: true })
    accessLog: string;
}
