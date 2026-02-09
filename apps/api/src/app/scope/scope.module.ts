import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from '../entities/organization.entity';
import { ScopeService } from './scope.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationEntity])],
  providers: [ScopeService],
  exports: [ScopeService],
})
export class ScopeModule {}
