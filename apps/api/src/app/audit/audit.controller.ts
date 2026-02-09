import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../auth/rbac.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { AuditService } from './audit.service';

@Controller('audit-log')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  @RequirePermissions('audit:read')
  list() {
    return this.audit.listRecent(100);
  }
}
