import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';
import { MyGroupModule } from './my-group/my-group.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormConfig from '../ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), GroupModule, MyGroupModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
