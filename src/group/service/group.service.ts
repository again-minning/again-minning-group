import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { Group } from '../../entities/group';
import { Category } from '../../common/enum/category';
import {
  GROUP_NOT_FOUND,
  GROUP_OK,
} from '../../common/response/content/message.group';
import { CommonResponse } from '../../common/response/response.message';
import { GroupResponseDto, GroupDetail } from '../dto/group.dto';

@Injectable()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}
  async getGroupList(category: Category): Promise<CommonResponse> {
    const groupList: Group[] =
      category != Category.ALL
        ? await this.groupRepository.findAllByCategory(category)
        : await this.groupRepository.findAll();
    return new CommonResponse(
      HttpStatus.OK,
      GROUP_OK,
      groupList.map((x) => new GroupResponseDto(x)),
    );
  }

  async getGroupDetail(id: number): Promise<CommonResponse> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }
    return new CommonResponse(HttpStatus.OK, GROUP_OK, new GroupDetail(group));
  }

  public async existById(groupId: number): Promise<boolean> {
    return await this.groupRepository.existById(groupId);
  }
}
