import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RbacGuard } from './auth/rbac.guard';
import { RequirePermissions } from './auth/permissions.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('secure-test')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions('task:read')
  secureTest() {
    return { ok: true };
  }

  getData() {
    return this.appService.getData();
  }
}
