import { Injectable } from '@nestjs/common';
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
    const runner = await this.getQueryRunnerAndStartTransaction();
    await this.isGroup(req.groupId);
    try {
      const savedGroup = await runner.manager
        .getRepository(MyGroup)
        .save(this.createNewMyGroup(req));
      const weekList: MyGroupWeek[] = this.createWeekList(
        savedGroup,
        req.weekList,
      );
      await runner.manager.getRepository(MyGroupWeek).save(weekList);
      await runner.commitTransaction();
      return new MyGroupResponse(savedGroup, weekList);
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

  private async isGroup(groupId: number) {
    await this.groupService.findGroupById(groupId);
  }

  private async getQueryRunnerAndStartTransaction(): Promise<QueryRunner> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  private static getTotalDateCnt(last: Date): number {
    const dateTime = new Date().setHours(9, 0, 0, 0);
    const lastDateTime = new Date(last).setHours(9, 0, 0, 0);
    const time = lastDateTime - dateTime;
    return Math.floor(time / 1000 / 60 / 60 / 24 + 1);
  }
}
