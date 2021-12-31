import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { Group } from '../../entities/group';
import { GroupDetailDto, GroupResponseListDto } from '../dto/group.dto';
import { Category } from '../../common/enum/category';
import { GROUP_NOT_FOUND } from '../../common/response/content/message.group';

@Injectable()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}
  async getGroupList(category: Category): Promise<GroupResponseListDto> {
    const groupList: Group[] =
      category != Category.ALL
        ? await this.groupRepository.findAllByCategory(category)
        : await this.groupRepository.findAll();
    return new GroupResponseListDto(groupList);
  }

  async getGroupDetail(id: number): Promise<GroupDetailDto> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }
    return new GroupDetailDto(group);
  }

  public async existById(groupId: number): Promise<boolean> {
    return await this.groupRepository.existById(groupId);
  }
}
