import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MyGroupCreate,
  MyGroupRequest,
  MyGroupSimple,
} from '../dto/my.group.dto';
import { MyGroupRepository } from '../repository/my-group.repository';
import { Connection, QueryRunner, Repository } from 'typeorm';
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
  INVALID_TIME,
  IS_DONE,
  MY_GROUP_NOT_FOUND,
  NOT_EXIST_GROUP,
  QUERY_BAD_REQUEST,
} from '../../common/response/content/message.my-group';
import { Image } from '../../entities/image';

@Injectable()
export class MyGroupService {
  constructor(
    private myGroupRepository: MyGroupRepository,
    private connection: Connection,
    private groupService: GroupService,
    @InjectRepository(MyGroupWeek)
    private myGroupWeekRepository: Repository<MyGroupWeek>,
  ) {}

  public async doneDayMyGroup(
    myGroupId: number,
    userId: number,
    file: Express.Multer.File,
  ): Promise<void> {
    const myGroup = await this.checkIsMine(myGroupId, userId);
    await this.checkValid(myGroup, file);
    myGroup.doneDayMyGroup();
    delete myGroup.weekList; // my_group_week로 알 수 없는 update query가 나가서 일단 제거로 해결
    const runner = await this.getQueryRunnerAndStartTransaction();
    try {
      await runner.manager
        .getRepository(Image)
        .save(MyGroupService.createImage(myGroup, file));
      await runner.manager.getRepository(MyGroup).save(myGroup); // don't work save without select..
      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      console.error(err);
    } finally {
      await runner.release();
    }
  }

  public async getMyGroupList(active, userId): Promise<MyGroupSimple[]> {
    MyGroupService.checkBooleanQuery(active);
    const sampleList = await this.myGroupRepository.findAllByStatusAndUserId(
      active,
      userId,
    );
    return this.makeMyGroupResponseList(sampleList);
  }

  public async createMyGroup(req: MyGroupRequest): Promise<MyGroupCreate> {
    await this.isGroup(req.groupId);
    await this.checkIsExistOnActive(req.groupId, req.userId);
    const runner = await this.getQueryRunnerAndStartTransaction();
    try {
      const myGroup = await runner.manager
        .getRepository(MyGroup)
        .save(this.createNewMyGroup(req));
      const weekList: MyGroupWeek[] = this.createWeekList(
        myGroup,
        req.weekList,
      );
      const savedWeekList = await runner.manager
        .getRepository(MyGroupWeek)
        .save(weekList);
      await runner.commitTransaction();
      return new MyGroupCreate(myGroup, savedWeekList);
    } catch (err) {
      await runner.rollbackTransaction();
      console.error(err);
    } finally {
      await runner.release();
    }
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

  private async isGroup(groupId: number) {
    const result = await this.groupService.existById(groupId);
    if (!result) {
      throw new BadRequestException(NOT_EXIST_GROUP);
    }
  }

  private async checkIsExistOnActive(groupId: number, userId: number) {
    const result = await this.myGroupRepository.existOnActive(groupId, userId);
    if (result) {
      throw new BadRequestException(DUPLICATE_MY_GROUP);
    }
  }

  private async getQueryRunnerAndStartTransaction(): Promise<QueryRunner> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  private async checkIsMine(
    myGroupId: number,
    userId: number,
  ): Promise<MyGroup> {
    const myGroup = await this.myGroupRepository.findOne(myGroupId, {
      relations: ['group', 'weekList'],
    });
    if (!myGroup) {
      throw new NotFoundException(MY_GROUP_NOT_FOUND);
    }
    if (myGroup.userId != userId) {
      throw new BadRequestException(INVALID_MY_GROUP_ID);
    }
    return myGroup;
  }

  private async checkValid(myGroup: MyGroup, file: Express.Multer.File) {
    const date = new Date();
    const hour = date.getHours();
    const day = date.getDay();
    const weekList = myGroup.weekList.map((myWeek) => {
      return Number(Week[myWeek.week]);
    });
    if (!(hour <= 8 && hour >= 5)) {
      throw new BadRequestException(INVALID_TIME);
    }
    if (!weekList.includes(day)) {
      throw new BadRequestException(INVALID_DATE);
    }
    if (myGroup.isDone) {
      throw new BadRequestException(IS_DONE);
    }
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
}
