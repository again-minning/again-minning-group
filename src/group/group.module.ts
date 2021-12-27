import { Module } from '@nestjs/common';
import { GroupController } from './controller/group.controller';
import { GroupService } from './service/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRepository } from './repository/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
