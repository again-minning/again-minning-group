import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';
import { MyGroupModule } from './my-group/my-group.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormConfig from '../ormconfig';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './common/exception/custom.exception.filter';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), GroupModule, MyGroupModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
