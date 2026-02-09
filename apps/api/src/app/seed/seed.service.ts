import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { OrganizationEntity } from '../entities/organization.entity';
import { UserEntity } from '../entities/user.entity';
import { TaskEntity } from '../entities/task.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly orgRepo: Repository<OrganizationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
  ) {}

  async onApplicationBootstrap() {
    // Optional: allow disabling seed
    if (process.env.SEED_DISABLE === 'true') {
      this.logger.warn('Seeding disabled via SEED_DISABLE=true');
      return;
    }

    // Idempotency: if any users exist, assume seeded
    const existingUsers = await this.userRepo.count();
    if (existingUsers > 0) {
      this.logger.log('Seed skipped (users already exist).');
      return;
    }

    this.logger.log('Seeding database...');

    // 1) Orgs: Parent + Child
    const parentOrg = this.orgRepo.create({ name: 'Acme Corp', parentOrgId: null });
    await this.orgRepo.save(parentOrg);

    const childOrg = this.orgRepo.create({ name: 'Acme Subsidiary', parentOrgId: parentOrg.id });
    await this.orgRepo.save(childOrg);

    // 2) Users
    const passwordPlain = 'Password123!'; // demo only; document in README
    const passwordHash = await bcrypt.hash(passwordPlain, 10);

    const owner = this.userRepo.create({
      email: 'owner@acme.com',
      passwordHash,
      role: 'Owner',
      organizationId: parentOrg.id,
    });

    const admin = this.userRepo.create({
      email: 'admin@acme.com',
      passwordHash,
      role: 'Admin',
      organizationId: childOrg.id,
    });

    const viewer = this.userRepo.create({
      email: 'viewer@acme.com',
      passwordHash,
      role: 'Viewer',
      organizationId: childOrg.id,
    });

    await this.userRepo.save([owner, admin, viewer]);

    // 3) Tasks (a few in each org)
    const tasks: Partial<TaskEntity>[] = [
      {
        title: 'Parent: Review RBAC design',
        description: 'Confirm role-permission matrix and org scope rules.',
        category: 'Work',
        status: 'Todo',
        position: 0,
        organizationId: parentOrg.id,
        createdByUserId: owner.id,
      },
      {
        title: 'Parent: Prepare demo script',
        description: 'Plan quick walkthrough steps for video.',
        category: 'Work',
        status: 'InProgress',
        position: 1,
        organizationId: parentOrg.id,
        createdByUserId: owner.id,
      },
      {
        title: 'Child: Implement tasks CRUD',
        description: 'Create/Read/Update/Delete endpoints with scoped queries.',
        category: 'Work',
        status: 'Todo',
        position: 0,
        organizationId: childOrg.id,
        createdByUserId: admin.id,
      },
      {
        title: 'Child: Verify viewer read-only',
        description: 'Ensure viewer cannot create/update/delete tasks.',
        category: 'Work',
        status: 'Todo',
        position: 1,
        organizationId: childOrg.id,
        createdByUserId: admin.id,
      },
    ];

    await this.taskRepo.save(tasks.map((t) => this.taskRepo.create(t)));

    this.logger.log('Seeding complete ✅');
    this.logger.log(`Demo password for all users: ${passwordPlain}`);
  }
}
