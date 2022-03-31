import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusRepository } from './status.repository';
import { Status } from './status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(StatusRepository)
    private statusesRepository: StatusRepository,
  ) {}

  async getTasksStatuses(): Promise<Status[]> {
    return this.statusesRepository.getStatuses();
  }
}
