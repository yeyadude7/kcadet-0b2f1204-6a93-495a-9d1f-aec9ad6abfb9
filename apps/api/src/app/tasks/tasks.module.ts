import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../entities/task.entity';
import { ScopeModule } from '../scope/scope.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuditModule } from '../audit/audit.module';
@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), ScopeModule, AuditModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
