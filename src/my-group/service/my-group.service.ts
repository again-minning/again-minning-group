import { BadRequestException, Injectable } from '@nestjs/common';
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
  NOT_EXIST_GROUP,
  QUERY_BAD_REQUEST,
} from '../../common/response/content/message.my-group';

@Injectable()
export class MyGroupService {
  constructor(
    private myGroupRepository: MyGroupRepository,
    private connection: Connection,
    private groupService: GroupService,
    @InjectRepository(MyGroupWeek)
    private myGroupWeekRepository: Repository<MyGroupWeek>,
  ) {}

  public async getMyGroupList(active, userId): Promise<MyGroupSimple[]> {
    MyGroupService.checkBooleanQuery(active);
    const sampleList = await this.myGroupRepository.findAllByStatusAndUserId(
      active,
      userId,
    );
    return this.makeMyGroupResponseList(sampleList);
  }

  async createMyGroup(req: MyGroupRequest): Promise<MyGroupCreate> {
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
}
