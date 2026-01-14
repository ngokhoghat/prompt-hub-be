import { Entity, Column } from "typeorm";
import { CustomBaseEntity } from "src/config/_common/entities/base.entity";

@Entity({ name: "audit_log" })
export class AuditLog extends CustomBaseEntity {
    @Column()
    entity_type: string;

    @Column()
    entity_id: string;

    @Column()
    action: string;

    @Column()
    before: string;

    @Column()
    after: string;
}
