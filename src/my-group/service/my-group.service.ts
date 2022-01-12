import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MyGroupCreate,
  MyGroupDetail,
  MyGroupDoneAndAllCnt,
  MyGroupRequest,
  MyGroupSimple,
} from '../dto/my.group.dto';
import { MyGroupRepository } from '../repository/my-group.repository';
import { Connection, EntityManager, Repository } from 'typeorm';
import { MyGroup } from '../../entities/my.group';
import { GroupService } from '../../group/service/group.service';
import { MyGroupWeek } from '../../entities/my.group.week';
import { InjectRepository } from '@nestjs/typeorm';
import { Week } from '../../common/enum/week';
import {
  DUPLICATE_MY_GROUP,
  INVALID_DATE,
  INVALID_IMAGE,
  INVALID_MY_GROUP_ID,
  IS_DONE,
  MY_GROUP_NOT_FOUND,
  QUERY_BAD_REQUEST,
} from '../../common/response/content/message.my-group';
import { Image } from '../../entities/image';
import { ImageRepository } from '../../image/image.repository';
import { Order } from '../../common/enum/Order';
import { ImageDto } from '../../image/image.dto';
import { Group } from '../../entities/group';

@Injectable()
export class MyGroupService {
  constructor(
    private myGroupRepository: MyGroupRepository,
    private imageRepository: ImageRepository,
    private connection: Connection,
    private groupService: GroupService,
    @InjectRepository(MyGroupWeek)
    private myGroupWeekRepository: Repository<MyGroupWeek>,
  ) {}

  public async getImageList(
    userId,
    myGroupId,
    lastId,
    order,
  ): Promise<ImageDto[]> {
    const orderBy = order == 'true' ? Order.DESC : Order.ASC;
    return this.imageRepository.findAllByUserIdAndMyGroupId(
      userId,
      myGroupId,
      lastId,
      orderBy,
    );
  }

  public async getMyGroupDetail(
    myGroupId: number,
    userId: number,
  ): Promise<MyGroupDetail> {
    const myGroup = await this.myGroupRepository.findOneWithGroup(myGroupId);
    this.checkIsNotNull(myGroup);
    this.checkIsMine(myGroup, userId);
    const imageList = myGroup.status
      ? await this.imageRepository.findAllByMyGroupId(myGroupId)
      : await this.imageRepository.findAllByUserIdAndMyGroupId(
          userId,
          myGroupId,
        );
    return new MyGroupDetail(myGroup, imageList);
  }

  public async getMyGroupDoneStatus(
    userId: number,
  ): Promise<MyGroupDoneAndAllCnt> {
    return await this.myGroupRepository.countAllCntAndDoneCntByStatusTrueAndUserId(
      userId,
    );
  }

  public async deleteMyGroup(myGroupId: number, userId: number): Promise<void> {
    const myGroup = await this.findMyGroup(myGroupId, userId);
    await this.myGroupRepository.remove(myGroup);
  }

  public async doneDayMyGroup(
    myGroupId: number,
    userId: number,
    file: Express.Multer.File,
    manager: EntityManager,
  ): Promise<void> {
    const myGroup = await this.findMyGroup(myGroupId, userId);
    this.checkDoneRequestIsValid(myGroup, file);
    myGroup.doneDayMyGroup();
    delete myGroup.weekList; // my_group_week로 알 수 없는 update query가 나가서 일단 제거로 해결
    await manager
      .getRepository(Image)
      .save(MyGroupService.createImage(myGroup, file));
    await manager.getRepository(MyGroup).save(myGroup); // don't work save without select..
  }

  public async getMyGroupList(active, userId): Promise<MyGroupSimple[]> {
    MyGroupService.checkBooleanQuery(active);
    const sampleList = await this.myGroupRepository.findAllByStatusAndUserId(
      active,
      userId,
    );
    return this.makeMyGroupResponseList(sampleList);
  }

  public async createMyGroup(
    req: MyGroupRequest,
    manager: EntityManager,
  ): Promise<MyGroupCreate> {
    await this.groupService.checkExistById(req.groupId);
    await this.checkIsExistOnActive(req.groupId, req.userId);
    const myGroup = await manager
      .getRepository(MyGroup)
      .save(this.createNewMyGroup(req));
    const weekList: MyGroupWeek[] = this.createWeekList(myGroup, req.weekList);
    const savedWeekList = await manager
      .getRepository(MyGroupWeek)
      .save(weekList);
    return new MyGroupCreate(myGroup, savedWeekList);
  }

  private static checkBooleanQuery(active) {
    if (active != 'true' && active != 'false') {
      throw new BadRequestException(QUERY_BAD_REQUEST);
    }
  }

  private makeMyGroupResponseList(dataList: MyGroup[]) {
    return dataList.map((data) => {
      const rate =
        (data.successCnt / MyGroupService.getPassDateCnt(data.createdAt)) * 100;
      return new MyGroupSimple(data, rate);
    });
  }

  private createNewMyGroup(req: MyGroupRequest) {
    return this.myGroupRepository.create({
      userId: req.userId,
      group: { groupId: req.groupId },
      alarmTime: req.alarmTime,
      lastDate: req.lastDate,
      successCnt: 0,
      rate: 0,
      status: true,
      isDone: false,
      totalDateCnt: MyGroupService.getTotalDateCnt(req.lastDate),
    });
  }

  private createWeekList(myGroup: MyGroup, weekList: Week[]) {
    return weekList.map((week) =>
      this.myGroupWeekRepository.create({
        myGroup: myGroup,
        week: week,
      }),
    );
  }

  private static getTotalDateCnt(last: Date): number {
    const dateTime = new Date().setHours(9, 0, 0, 0);
    const lastDateTime = new Date(last).setHours(9, 0, 0, 0);
    const time = lastDateTime - dateTime;
    return Math.floor(time / 1000 / 60 / 60 / 24 + 1);
  }

  private static getPassDateCnt(start: Date): number {
    const dateTime = new Date().setHours(9, 0, 0, 0);
    const startDateTime = new Date(start).setHours(9, 0, 0, 0);
    const time = dateTime - startDateTime;
    return Math.floor(time / 1000 / 60 / 60 / 24 + 1);
  }

  private async checkIsExistOnActive(groupId: number, userId: number) {
    const result = await this.myGroupRepository.existOnActive(groupId, userId);
    if (result) {
      throw new BadRequestException(DUPLICATE_MY_GROUP);
    }
  }

  private async findMyGroup(
    myGroupId: number,
    userId: number,
  ): Promise<MyGroup> {
    const myGroup = await this.myGroupRepository.findOne(myGroupId, {
      relations: ['group', 'weekList'],
    });
    this.checkIsNotNull(myGroup);
    this.checkIsMine(myGroup, userId);
    return myGroup;
  }

  private checkIsMine(myGroup: MyGroup, userId: number): void {
    if (myGroup.userId != userId) {
      throw new BadRequestException(INVALID_MY_GROUP_ID);
    }
  }

  private checkIsNotNull(myGroup: MyGroup): void {
    if (!myGroup) {
      throw new NotFoundException(MY_GROUP_NOT_FOUND);
    }
  }
  private checkDoneRequestIsValid(
    myGroup: MyGroup,
    file: Express.Multer.File,
  ): void {
    const date = new Date();
    const weekList = myGroup.weekList.map((myWeek) => {
      return Number(Week[myWeek.week]);
    });
    myGroup.group.checkTime();
    this.checkDayIsInclude(date, weekList);
    this.checkIsDone(myGroup);
    this.checkFileIsNotNull(file);
  }

  private checkDayIsInclude(date: Date, weekList: Week[]): void {
    const day = date.getDay();
    if (!weekList.includes(day)) {
      throw new BadRequestException(INVALID_DATE);
    }
  }

  private checkIsDone(myGroup: MyGroup): void {
    if (myGroup.isDone) {
      throw new BadRequestException(IS_DONE);
    }
  }

  private checkFileIsNotNull(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException(INVALID_IMAGE);
    }
  }

  private static createImage(
    myGroup: MyGroup,
    file: Express.Multer.File,
  ): Image {
    const image = new Image();
    image.group = myGroup.group;
    image.myGroup = myGroup;
    image.userId = myGroup.userId;
    image.url = file.originalname + new Date().getMilliseconds();
    return image;
  }

  async updateIsDoneByMyGroupIds(myGroupIds: number[]) {
    const myGroupList = await this.myGroupRepository.findByIds(myGroupIds);
    myGroupList.forEach((myGroup) => myGroup.updateIsDone());
    await this.myGroupRepository.save(myGroupList);
  }

  async updateStatusByFinishedMyGroupIds(
    myGroupIds: number[],
    manager: EntityManager,
  ) {
    const myGroupList = await manager
      .getRepository(MyGroup)
      .findByIds(myGroupIds, {
        relations: ['group'],
      });
    const groupList = [];
    const groupMemberCntMap = this.initGroupMemberCntMap(myGroupList);
    const groupMap = this.initGroupMap(myGroupList);
    groupMap.forEach((group) => groupList.push(group));
    myGroupList.forEach((myGroup) => myGroup.updateIsStatus());
    groupMemberCntMap.forEach((memberCnt, key) => {
      groupMap.get(key).memberCnt -= memberCnt;
      groupMap.get(key).endGroupTotalCnt += memberCnt;
    });
    await manager.getRepository(MyGroup).save(myGroupList);
    await manager.getRepository(Group).save(groupList);
  }

  private initGroupMemberCntMap(myGroupList: MyGroup[]) {
    const groupMemberCntMap = new Map<number, number>();
    myGroupList.forEach((myGroup) => {
      groupMemberCntMap.set(myGroup.group.groupId, 0);
    });
    myGroupList.forEach((myGroup) => {
      groupMemberCntMap.set(
        myGroup.group.groupId,
        groupMemberCntMap.get(myGroup.group.groupId) + 1,
      );
    });
    return groupMemberCntMap;
  }

  private initGroupMap(myGroupList: MyGroup[]) {
    const groupMap = new Map<number, Group>();
    myGroupList.forEach((myGroup) => {
      groupMap.set(myGroup.group.groupId, myGroup.group);
    });
    myGroupList.forEach((myGroup) => {
      groupMap.get(myGroup.group.groupId).endGroupTotalRate += myGroup.rate;
    });
    return groupMap;
  }
}
