import { BadRequestException, Injectable } from '@nestjs/common';
import { MyGroupRequest, MyGroupResponse } from '../dto/my.group.dto';
import { MyGroupRepository } from '../repository/my-group.repository';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { MyGroup } from '../../entities/my.group';
import { GroupService } from '../../group/service/group.service';
import { MyGroupWeek } from '../../entities/my.group.week';
import { InjectRepository } from '@nestjs/typeorm';
import { Week } from '../../common/enum/week';

@Injectable()
export class MyGroupService {
  constructor(
    private myGroupRepository: MyGroupRepository,
    private connection: Connection,
    private groupService: GroupService,
    @InjectRepository(MyGroupWeek)
    private myGroupWeekRepository: Repository<MyGroupWeek>,
  ) {}

  async createMyGroup(req: MyGroupRequest): Promise<MyGroupResponse> {
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
      await runner.manager.getRepository(MyGroupWeek).save(weekList);
      await runner.commitTransaction();
      return new MyGroupResponse(myGroup, weekList);
    } catch (err) {
      await runner.rollbackTransaction();
      console.error(err);
    } finally {
      await runner.release();
    }
  }

  private createNewMyGroup(req: MyGroupRequest) {
    return this.myGroupRepository.create({
      userId: req.userId,
      group: { groupId: req.groupId },
      alarmTime: req.alarmTime,
      lastDate: req.lastDate,
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

  private async isGroup(groupId: number) {
    const result = await this.groupService.existById(groupId);
    if (!result) {
      throw new BadRequestException('그룹이 존재하지 않습니다.');
    }
  }

  private async checkIsExistOnActive(groupId: number, userId: number) {
    const result = await this.myGroupRepository.existOnActive(groupId, userId);
    if (result) {
      throw new BadRequestException('이미 진행중인 그룹 잆니다.');
    }
  }

  private async getQueryRunnerAndStartTransaction(): Promise<QueryRunner> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}
