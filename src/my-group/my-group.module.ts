import { Module } from '@nestjs/common';
import { MyGroupController } from './controller/my-group.controller';
import { MyGroupService } from './service/my-group.service';
import { GroupModule } from '../group/group.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyGroupRepository } from './repository/my-group.repository';
import { MyGroupWeek } from '../entities/my.group.week';
import { Image } from '../entities/image';

@Module({
  imports: [
    TypeOrmModule.forFeature([MyGroupRepository, MyGroupWeek, Image]),
    GroupModule,
  ],
  controllers: [MyGroupController],
  providers: [MyGroupService],
})
export class MyGroupModule {}
