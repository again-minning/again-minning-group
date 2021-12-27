import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { Group } from '../../entities/group';
import { GroupResponseListDto } from '../dto/group.dto';
import { Category } from '../../common/enum/category';

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
}
