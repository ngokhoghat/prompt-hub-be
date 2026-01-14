import { Column, Entity } from "typeorm";
import { CustomBaseEntity } from "src/config/_common/entities/base.entity";

@Entity()
export class AIModel extends CustomBaseEntity {
    @Column({ name: "name" })
    name: string;

    @Column({ name: "slug", unique: true })
    slug: string;

    @Column({ name: "logo_url", nullable: true })
    logoUrl: string;

    @Column({ name: "provider" })
    provider: string;

    @Column({ name: "description", type: "text", nullable: true })
    description: string;
}
