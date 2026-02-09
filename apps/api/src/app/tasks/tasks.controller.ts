import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../auth/rbac.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

type AuthedRequest = Request & {
  user: { userId: string; organizationId: string; role: string; email: string };
};

@Controller('tasks')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  @RequirePermissions('task:read')
  list(@Req() req: AuthedRequest) {
    return this.tasks.listForUser(req.user.organizationId);
  }

  @Get(':id')
  @RequirePermissions('task:read')
  get(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.tasks.getByIdForUser(id, req.user.organizationId, req.user.userId, req.ip);
  }

  @Post()
  @RequirePermissions('task:create')
  create(@Body() dto: CreateTaskDto, @Req() req: AuthedRequest) {
    return this.tasks.createForUser(dto, req.user.userId, req.user.organizationId, req.ip);
  }

  @Put(':id')
  @RequirePermissions('task:update')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req: AuthedRequest) {
    return this.tasks.updateForUser(id, dto, req.user.organizationId, req.user.userId, req.ip);
  }

  @Delete(':id')
  @RequirePermissions('task:delete')
  remove(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.tasks.deleteForUser(id, req.user.organizationId, req.user.userId, req.ip);
  }
}
