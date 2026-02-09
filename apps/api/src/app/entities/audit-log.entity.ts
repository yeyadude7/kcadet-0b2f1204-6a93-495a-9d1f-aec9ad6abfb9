import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

export type AuditResult = 'ALLOW' | 'DENY';

@Entity('audit_logs')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  timestamp!: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  user!: UserEntity;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'text' })
  action!: string;

  @Column({ type: 'text' })
  resourceType!: string;

  @Column({ type: 'text', nullable: true })
  resourceId?: string | null;

  @Column({ type: 'text' })
  result!: AuditResult;

  @Column({ type: 'text', nullable: true })
  reason?: string | null;

  @Column({ type: 'text', nullable: true })
  ip?: string | null;
}
