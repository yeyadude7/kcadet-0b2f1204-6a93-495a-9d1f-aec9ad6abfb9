import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { UserEntity } from './user.entity';

export type TaskStatus = 'Todo' | 'InProgress' | 'Done';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text' })
  category!: string;

  @Column({ type: 'text' })
  status!: TaskStatus;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @ManyToOne(() => OrganizationEntity, { nullable: false, onDelete: 'CASCADE' })
  organization!: OrganizationEntity;

  @Column({ type: 'uuid' })
  organizationId!: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  createdByUser!: UserEntity;

  @Column({ type: 'uuid' })
  createdByUserId!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: string;
}
