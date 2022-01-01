import { Controller, Get, Param } from '@nestjs/common';
import { GroupService } from '../service/group.service';
import { CommonResponse } from '../../common/response/response.message';

@Controller('/api/v1/group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get('/:category')
  // Todo -> @UseGuards
  public async getGroupList(
    @Param('category') category,
  ): Promise<CommonResponse> {
    return await this.groupService.getGroupList(category);
  }

  @Get('/detail/:groupId')
  // Todo -> @UseGuards
  public async getGroupDetail(@Param('groupId') id): Promise<CommonResponse> {
    return await this.groupService.getGroupDetail(id);
  }
}
