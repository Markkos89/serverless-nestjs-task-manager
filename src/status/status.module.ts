import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusRepository } from './status.repository';
import { StatusService } from './status.service';
import { AuthModule } from '../auth/auth.module';
import { StatusController } from './status.controller';
/*
because the tasks controller is defined as a controller in this module and the
tasks service is defined as a provider in this module and also has the @Injectable decorator,
so that allows the tasks service to be injected and then used in the tasks controller
*/

@Module({
  controllers: [StatusController],
  providers: [StatusService],
  // imports, injects dependencies to be able to use them anywhere inside the current module
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([StatusRepository]),
    AuthModule,
  ],
  exports: [StatusService],
})
export class StatusModule {}
