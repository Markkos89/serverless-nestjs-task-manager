import { EntityRepository, Repository } from 'typeorm';
import { Status } from './status.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Status)
export class StatusRepository extends Repository<Status> {
  private logger = new Logger('StatusRepository', { timestamp: true });

  async getStatuses(): Promise<Status[]> {
    try {
      const query = this.createQueryBuilder('task_status');
      const statuses = await query.getMany();
      return statuses;
    } catch (e) {
      this.logger.error(`Failed to get statuses`, e.stack);
      throw e;
    }
  }
}
