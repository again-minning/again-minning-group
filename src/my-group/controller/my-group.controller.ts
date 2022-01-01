import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MyGroupService } from '../service/my-group.service';
import { MyGroupCreateResponse, MyGroupRequest } from '../dto/my.group.dto';

@Controller('/api/v1/my-group')
export class MyGroupController {
  constructor(private readonly myGroupService: MyGroupService) {}

  @Post('/')
  // Todo -> UseGuard(...)
  public async createMyGroup(
    @Body() req: MyGroupRequest,
  ): Promise<MyGroupCreateResponse> {
    return this.myGroupService.createMyGroup(req);
  }

  @Get('/all')
  public async getMyGroupList(@Query() query) {
    return this.myGroupService.getMyGroupList(query.active, query.userId);
  }
}
