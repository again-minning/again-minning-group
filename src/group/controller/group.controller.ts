import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { GroupService } from '../service/group.service';
import { GroupDetail, GroupResponseDto } from '../dto/group.dto';
import { ResponseEntity } from '../../common/response/response.entity';
import { GROUP_OK } from '../../common/response/content/message.group';
import { ResponseMessage } from '../../common/response/response.message';

@Controller('/api/v1/group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get('/:category')
  // Todo -> @UseGuards
  public async getGroupList(
    @Param('category') category,
  ): Promise<ResponseEntity<GroupResponseDto[]>> {
    return ResponseEntity.OK_WITH(
      new ResponseMessage(HttpStatus.OK, GROUP_OK),
      await this.groupService.getGroupList(category),
    );
  }

  @Get('/detail/:groupId')
  // Todo -> @UseGuards
  public async getGroupDetail(
    @Param('groupId') id,
  ): Promise<ResponseEntity<GroupDetail>> {
    return ResponseEntity.OK_WITH(
      new ResponseMessage(HttpStatus.OK, GROUP_OK),
      await this.groupService.getGroupDetail(id),
    );
  }
}
