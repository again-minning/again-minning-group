import { Body, Controller, Post } from '@nestjs/common';
import { MyGroupService } from '../service/my-group.service';
import { MyGroupRequest, MyGroupResponse } from '../dto/my.group.dto';

@Controller('/api/v1/my-group')
export class MyGroupController {
  constructor(private readonly myGroupService: MyGroupService) {}

  @Post('/')
  // Todo -> UseGuard(...)
  public async createMyGroup(
    @Body() req: MyGroupRequest,
  ): Promise<MyGroupResponse> {
    return this.myGroupService.createMyGroup(req);
  }
}
