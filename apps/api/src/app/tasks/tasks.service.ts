import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { ScopeService } from '../scope/scope.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity) private readonly taskRepo: Repository<TaskEntity>,
    private readonly scope: ScopeService,
    private readonly audit: AuditService,
  ) {}

  async listForUser(userOrgId: string) {
    const orgIds = await this.scope.getAccessibleOrgIds(userOrgId);
    return this.taskRepo.find({
      where: { organizationId: In(orgIds) },
      order: { createdAt: 'DESC' as any },
    });
  }

    async getByIdForUser(taskId: string, userOrgId: string, userId?: string, ip?: string) {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const ok = await this.scope.assertOrgInScope(userOrgId, task.organizationId);
    if (!ok) {
        if (userId) {
        await this.audit.deny({
            userId,
            action: 'task:get',
            resourceType: 'task',
            resourceId: taskId,
            reason: 'Task out of org scope',
            ip: ip ?? null,
        });
        }
        throw new ForbiddenException('Task out of scope');
    }

    return task;
    }


    async createForUser(dto: CreateTaskDto, userId: string, userOrgId: string, ip?: string) {
    const task = this.taskRepo.create({
        ...dto,
        position: 0,
        organizationId: userOrgId,
        createdByUserId: userId,
    });
    const saved = await this.taskRepo.save(task);

    await this.audit.allow({
        userId,
        action: 'task:create',
        resourceType: 'task',
        resourceId: saved.id,
        ip: ip ?? null,
    });

    return saved;
    }

    async updateForUser(taskId: string, dto: UpdateTaskDto, userOrgId: string, userId: string, ip?: string) {
    const task = await this.getByIdForUser(taskId, userOrgId, userId, ip);
    Object.assign(task, dto);
    const saved = await this.taskRepo.save(task);

    await this.audit.allow({
        userId,
        action: 'task:update',
        resourceType: 'task',
        resourceId: saved.id,
        ip: ip ?? null,
    });

    return saved;
    }

    async deleteForUser(taskId: string, userOrgId: string, userId: string, ip?: string) {
    const task = await this.getByIdForUser(taskId, userOrgId, userId, ip);
    await this.taskRepo.delete({ id: task.id });

    await this.audit.allow({
        userId,
        action: 'task:delete',
        resourceType: 'task',
        resourceId: task.id,
        ip: ip ?? null,
    });

    return { deleted: true };
    }

}
