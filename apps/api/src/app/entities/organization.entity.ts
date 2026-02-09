import {
  Column,
  Entity,
  Index,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('organizations')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  @Index({ unique: true })
  name!: string;

  @ManyToOne(() => OrganizationEntity, (org) => org.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent?: OrganizationEntity | null;

  @Column({ type: 'uuid', nullable: true })
  parentOrgId?: string | null;

  @OneToMany(() => OrganizationEntity, (org) => org.parent)
  children!: OrganizationEntity[];
}
