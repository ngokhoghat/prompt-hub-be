import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export abstract class CustomBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'creator_id', nullable: true })
  creatorId: String;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updater_id', nullable: true })
  updaterId: String;

  @UpdateDateColumn({ name: 'updater_at' })
  updatedAt: Date;

  @Column({ name: 'is_delete', default: false })
  isDelete: boolean;
}
