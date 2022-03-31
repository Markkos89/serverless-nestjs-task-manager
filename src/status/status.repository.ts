import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Status } from './status.entity';

@EntityRepository(Status)
export class StatusRepository extends Repository<Status> {
  // constructor(static logger: Logger, static query: any);

  private logger = new Logger('StatusRepository', { timestamp: true });

  async getStatuses(): Promise<any> {
    console.log('--------------------------');
    try {
      const statuses = await this.query('SELECT * FROM status');
      // this.query = await this.createQueryBuilder('task_status');
      // const statuses = await this.query.find({ select: ['id', 'name', 'value'] });

      // .getMany();
      console.log(statuses);
      return statuses;
    } catch (e) {
      console.log(e);
      this.logger.error(`Failed to get statuses`, e.stack);

      throw e;
    }
  }
}
