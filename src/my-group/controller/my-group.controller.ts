import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { MyGroupService } from '../service/my-group.service';
import {
  MyGroupCreate,
  MyGroupRequest,
  MyGroupSimple,
} from '../dto/my.group.dto';
import { ResponseEntity } from '../../common/response/response.entity';
import {
  MY_GROUP_CREATE_OK,
  MY_GROUP_OK,
} from '../../common/response/content/message.my-group';
import { ResponseMessage } from '../../common/response/response.message';

@Controller('/api/v1/my-group')
export class MyGroupController {
  constructor(private readonly myGroupService: MyGroupService) {}

  @Post('/')
  // Todo -> UseGuard(...)
  public async createMyGroup(
    @Body() req: MyGroupRequest,
  ): Promise<ResponseEntity<MyGroupCreate>> {
    return ResponseEntity.OK_WITH(
      new ResponseMessage(HttpStatus.OK, MY_GROUP_CREATE_OK),
      await this.myGroupService.createMyGroup(req),
    );
  }

  @Get('/all')
  // Todo -> UseGuard(...)
  public async getMyGroupList(
    @Query() query,
  ): Promise<ResponseEntity<MyGroupSimple[]>> {
    return ResponseEntity.OK_WITH(
      new ResponseMessage(HttpStatus.OK, MY_GROUP_OK),
      await this.myGroupService.getMyGroupList(query.active, query.userId),
    );
  }
}
