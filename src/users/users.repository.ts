import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger('UsersRepository', { timestamp: true });

  async createUser(dto: AuthCredentialsDto): Promise<User> {
    const { username, password } = dto;

    try {
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      const user = this.create({ username, password: hashed });

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
}
