import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // imports, injects dependencies to be able to use them anywhere inside the current module
  imports: [TypeOrmModule.forFeature([UsersRepository]), AuthModule],
})
export class UsersModule {}
