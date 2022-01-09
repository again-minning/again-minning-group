import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { Group } from '../../entities/group';
import { GroupDetail, GroupResponseDto } from '../dto/group.dto';
import { Category } from '../../common/enum/category';
import { GROUP_NOT_FOUND } from '../../common/response/content/message.group';
import { ImageRepository } from '../../image/image.repository';

@Injectable()
export class GroupService {
  constructor(
    private groupRepository: GroupRepository,
    private imageRepository: ImageRepository,
  ) {}
  async getGroupList(category: Category): Promise<GroupResponseDto[]> {
    const groupList: Group[] =
      category != Category.ALL
        ? await this.groupRepository.findAllByCategory(category)
        : await this.groupRepository.findAll();
    return groupList.map((x) => new GroupResponseDto(x));
  }

  async getGroupDetail(id: number): Promise<GroupDetail> {
    const group = await this.groupRepository.findOne(id);
    const imageList = await this.imageRepository.findAllByGroupId(id);
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }
    return new GroupDetail(group, imageList);
  }

  public async existById(groupId: number): Promise<boolean> {
    return await this.groupRepository.existById(groupId);
  }
}
