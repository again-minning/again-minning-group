import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { MyGroupService } from '../../my-group/service/my-group.service';

@Injectable()
export class GroupService {
  constructor(
    private groupRepository: GroupRepository,
    private imageRepository: ImageRepository,
    @Inject(forwardRef(() => MyGroupService))
    private myGroupService: MyGroupService,
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

  async calAvgRateAndInitToDayCnt(groupIds: number[]) {
    const groupList = await this.groupRepository.findByIds(groupIds);
    const result = await this.myGroupService.getRateSunAndCntByStatusIsTrue();
    const groupMap = this.initGroupMap(groupList);
    this.setSumAndCntByStatusTrue(result, groupMap);
    this.initToDayCntAndCalAvgRateBySumAndCnt(groupList, groupMap);
    await this.groupRepository.save(groupList);
  }

  private initGroupMap(groupList: Group[]) {
    const groupMap = new Map<number, { end_sum; end_cnt; sum; cnt }>();
    groupList.forEach((group) => {
      groupMap.set(group.groupId, {
        end_sum: group.endGroupTotalRate,
        end_cnt: group.endGroupTotalCnt,
        sum: 0,
        cnt: 0,
      });
    });
    return groupMap;
  }

  private initToDayCntAndCalAvgRateBySumAndCnt(groupList, groupMap) {
    groupList.forEach((group) => {
      groupMap.forEach((value, key) => {
        if (group.groupId == key) {
          group.calAvgRate(
            Number(value.sum) + Number(value.end_sum),
            Number(value.cnt) + Number(value.end_cnt),
          );
          group.initToDayCnt();
        }
      });
    });
  }

  private setSumAndCntByStatusTrue(result, groupMap) {
    result.forEach((rs) => {
      groupMap.forEach((value, key) => {
        if (rs.groupId == key) {
          value.sum = rs.sum;
          value.cnt = rs.cnt;
        }
      });
    });
  }
}
