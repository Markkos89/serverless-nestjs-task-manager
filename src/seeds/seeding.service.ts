import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { TaskStatus as TaskStatusEntity } from '../tasks/task-status.entity';
// import { RoleEntity } from 'src/entities/role.entity';

import { statuses as statusesSeeds } from './data/tasks-statuses';
// import { roleSeeds } from 'src/seeds/role.seeds';

@Injectable()
export class SeedingService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    // Replace with your own seeds
    await Promise.all([
      this.entityManager.save(TaskStatusEntity, statusesSeeds),
      //   this.entityManager.save(RoleEntity, roleSeeds),
    ]);
  }
}
