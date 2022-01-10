import { Module } from '@nestjs/common';
import { GroupController } from './controller/group.controller';
import { GroupService } from './service/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRepository } from './repository/group.repository';
import { ImageRepository } from '../image/image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository, ImageRepository])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
