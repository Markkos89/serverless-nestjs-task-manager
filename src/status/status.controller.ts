// eslint-disable-next-line
import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StatusService } from './status.service';
import { Status } from './status.entity';
// import { TaskStatus } from './task-status.enum';

@Controller('statuses')
@UseGuards(AuthGuard())
export class StatusController {
  private logger = new Logger('StatusController', { timestamp: true });

  /*
    to inject the tasks service in the tasks controller, we define an empty constructor
    with a parameter of the type of the service specifying an accessor (private in this case)
    declaring it with the accessor will automatically create the property in the controller class
    */

  constructor(private statusService: StatusService) {}

  @Get()
  getTasksStatuses(): Promise<Status[]> {
    this.logger.verbose(`User x retrieving statuses `);

    return this.statusService.getTasksStatuses();
  }
}
