import { Controller, Get, Param } from '@nestjs/common';
import { GroupService } from '../service/group.service';
import { GroupResponseListDto } from '../dto/group.dto';

@Controller('/api/v1/group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get('/:category')
  // Todo -> @UseGuards
  public async getGroupList(
    @Param('category') category,
  ): Promise<GroupResponseListDto> {
    return await this.groupService.getGroupList(category);
  }
}
