import { Module } from '@nestjs/common';
import { MyGroupController } from './my-group.controller';
import { MyGroupService } from './my-group.service';

@Module({
  controllers: [MyGroupController],
  providers: [MyGroupService],
})
export class MyGroupModule {}
