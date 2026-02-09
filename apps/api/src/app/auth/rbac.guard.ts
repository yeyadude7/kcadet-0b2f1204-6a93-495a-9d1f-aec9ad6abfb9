import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, RolePermissions } from '@org/auth';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private audit: AuditService,
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Permission[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
    );
    if (!required) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const ip = req.ip;

    const allowed: Permission[] = RolePermissions[user.role] ?? [];
    const ok = required.every((p) => allowed.includes(p));

    if (!ok) {
        await this.audit.deny({
        userId: user.userId,
        action: `rbac:${required.join(',')}`,
        resourceType: 'permission',
        resourceId: null,
        reason: `Role ${user.role} missing required permission(s)`,
        ip,
        });
        throw new ForbiddenException('Insufficient permissions');
    }

    // Optional: don’t spam ALLOW logs at guard level; we’ll log ALLOW at service/controller for tasks.
    return true;
    }

}
