import { Column, Entity } from "typeorm";
import { CustomBaseEntity } from "src/config/_common/entities/base.entity";

@Entity()
export class Tag extends CustomBaseEntity {
    @Column({ name: "name" })
    name: string;

    @Column({ name: "color", nullable: true })
    color: string;
}
