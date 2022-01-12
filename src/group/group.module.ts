import { forwardRef, Module } from '@nestjs/common';
import { GroupController } from './controller/group.controller';
import { GroupService } from './service/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRepository } from './repository/group.repository';
import { ImageRepository } from '../image/image.repository';
import { MyGroupModule } from '../my-group/my-group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupRepository, ImageRepository]),
    forwardRef(() => MyGroupModule),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
