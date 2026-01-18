import { Entity, Column } from "typeorm";
import { CustomBaseEntity } from "src/config/_common/entities/base.entity";

@Entity()
export class PromptSave extends CustomBaseEntity {
    @Column({ name: "prompt_id" })
    promptId: string;

    @Column({ name: "user_ip" })
    userIp: string;

    @Column({ name: "user_id", nullable: true })
    userId: string;
}
