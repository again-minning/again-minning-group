import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { Group } from '../../entities/group';
import { GroupDetail, GroupResponseDto } from '../dto/group.dto';
import { Category } from '../../common/enum/category';
import { GROUP_NOT_FOUND } from '../../common/response/content/message.group';
import { ImageRepository } from '../../image/image.repository';
import { NOT_EXIST_GROUP } from '../../common/response/content/message.my-group';
import { Order } from '../../common/enum/Order';

@Injectable()
export class GroupService {
  constructor(
    private groupRepository: GroupRepository,
    private imageRepository: ImageRepository,
  ) {}

  public async getImageList(groupId: number, lastId: number, order: string) {
    const orderBy = order == 'true' ? Order.DESC : Order.ASC;
    return await this.imageRepository.findAllByGroupId(
      groupId,
      lastId,
      orderBy,
    );
  }

  public async getGroupList(category: Category): Promise<GroupResponseDto[]> {
    const groupList: Group[] =
      category != Category.ALL
        ? await this.groupRepository.findAllByCategory(category)
        : await this.groupRepository.findAll();
    return groupList.map((x) => new GroupResponseDto(x));
  }

  public async getGroupDetail(id: number): Promise<GroupDetail> {
    const group = await this.groupRepository.findOne(id);
    const imageList = await this.imageRepository.findAllByGroupId(id);
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }
    return new GroupDetail(group, imageList);
  }

  public async checkExistById(groupId: number) {
    const result = await this.groupRepository.existById(groupId);
    if (!result) {
      throw new BadRequestException(NOT_EXIST_GROUP);
    }
  }
}
