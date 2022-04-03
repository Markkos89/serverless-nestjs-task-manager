import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: AuthCredentialsDto): Promise<User> {
    return this.usersRepository.createUser(dto);
  }

  async signIn(
    dto: AuthCredentialsDto,
  ): Promise<{ access_token: string; user: object }> {
    const { username, password } = dto;

    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const access_token: string = this.jwtService.sign(payload);
      const { password, ...cleanUser } = user;
      return { user: cleanUser, access_token };
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Invalid credentials'],
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
