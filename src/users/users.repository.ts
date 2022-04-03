import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger('UsersRepository', { timestamp: true });

  async createUser(dto: AuthCredentialsDto): Promise<User> {
    const { username, password } = dto;

    try {
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      const user = this.create({ ...dto, password: hashed });

      const savedUser = await this.save(user);

      return savedUser;
    } catch (e) {
      this.logger.error(
        `Failed to create user with username ${username}`,
        e.stack,
      );

      const errors = { 23505: 'A user with the same username already exists' };

      if (errors[e.code]) throw new ConflictException(errors[e.code]);

      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<User[]> {
    return this.find();
  }

  async findOneById(id: string): Promise<User> {
    return this.findOne(id);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const { username, password } = dto;

    try {
      const user = await this.findOne(id);

      if (user) {
        user.username = username;

        if (password) {
          const salt = await bcrypt.genSalt();
          const hashed = await bcrypt.hash(password, salt);

          user.password = hashed;
        }

        const savedUser = await this.save(user);

        return savedUser;
      }

      return null;
    } catch (e) {
      this.logger.error(`Failed to update user with id ${id}`, e.stack);

      throw new InternalServerErrorException();
    }
  }

  async removeById(id: string): Promise<void> {
    const user = await this.findOne(id);

    if (user) {
      await this.remove(user);
    } else {
      return;
    }
  }
}
