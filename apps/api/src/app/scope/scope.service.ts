import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrganizationEntity } from '../entities/organization.entity';

@Injectable()
export class ScopeService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly orgRepo: Repository<OrganizationEntity>,
  ) {}

  /**
   * Rule:
   * - User can always access their own org.
   * - If user's org is a parent, they can access direct children too.
   * (You can extend to recursive descendants later if desired.)
   */
  async getAccessibleOrgIds(userOrgId: string): Promise<string[]> {
    const children = await this.orgRepo.find({
      select: ['id'],
      where: { parentOrgId: userOrgId },
    });

    return [userOrgId, ...children.map((c) => c.id)];
  }

  /**
   * Convenience checker
   */
  async assertOrgInScope(userOrgId: string, targetOrgId: string): Promise<boolean> {
    const scope = await this.getAccessibleOrgIds(userOrgId);
    return scope.includes(targetOrgId);
  }
}
