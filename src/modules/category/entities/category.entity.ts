import { Column, Entity } from "typeorm";
import { CustomBaseEntity } from "src/config/_common/entities/base.entity";

@Entity()
export class Category extends CustomBaseEntity {
    @Column({ name: "name" })
    name: string;

    @Column({ name: "slug", unique: true })
    slug: string;

    @Column({ name: "description", type: "text", nullable: true })
    description: string;
}
