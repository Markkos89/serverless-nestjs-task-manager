import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFiltersDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async getTasks(dto: GetTasksFiltersDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(dto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ id, user });

    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);

    return task;
  }

  async createTask(dto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(dto, user);
  }

  async updateTaskStatus(
    id: string,
    dto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const { status } = dto;

    const task: Task = await this.getTaskById(id, user);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (!result?.affected)
      throw new NotFoundException(`Task with ID ${id} not found`);
  }

  async getTasksStatuses(): Promise<
    [
      { id: string; name: string; value: TaskStatus.OPEN },
      { id: string; name: string; value: TaskStatus.IN_PROGRESS },
      { id: string; name: string; value: TaskStatus.DONE },
    ]
  > {
    return new Promise((resolve, reject) => {
      resolve([
        {
          id: 'f357cc59-8169-4a78-bba6-aa4b2fe37f7d',
          name: 'Open',
          value: TaskStatus.OPEN,
        },
        {
          id: '5a9f76ab-d0a8-421b-8354-fe6bb14ddd68',
          name: 'In Progress',
          value: TaskStatus.IN_PROGRESS,
        },
        {
          id: 'f32ed0a9-5f23-4492-9c02-32ecaf8d92a0',
          name: 'Done',
          value: TaskStatus.DONE,
        },
      ]);
    });
  }
}
