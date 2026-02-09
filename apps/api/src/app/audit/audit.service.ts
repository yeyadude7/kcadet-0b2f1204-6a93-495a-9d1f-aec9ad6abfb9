import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity, AuditResult } from '../entities/audit-log.entity';

type AuditInput = {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  result: AuditResult;
  reason?: string | null;
  ip?: string | null;
};

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditRepo: Repository<AuditLogEntity>,
  ) {}

  async log(input: AuditInput) {
    const row = this.auditRepo.create({
      userId: input.userId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      result: input.result,
      reason: input.reason ?? null,
      ip: input.ip ?? null,
    });
    await this.auditRepo.save(row);
  }

  async allow(input: Omit<AuditInput, 'result'>) {
    return this.log({ ...input, result: 'ALLOW' });
  }

  async deny(input: Omit<AuditInput, 'result'>) {
    return this.log({ ...input, result: 'DENY' });
  }

  async listRecent(limit = 50) {
    return this.auditRepo.find({
      take: limit,
      order: { timestamp: 'DESC' as any },
    });
  }
}
