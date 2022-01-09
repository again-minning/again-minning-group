import { EntityRepository, Repository } from 'typeorm';
import { MyGroup } from '../../entities/my.group';
import { MyGroupDoneAndAllCnt } from '../dto/my.group.dto';

@EntityRepository(MyGroup)
export class MyGroupRepository extends Repository<MyGroup> {
  public async existOnActive(
    groupId: number,
    userId: number,
  ): Promise<boolean> {
    const result: Array<object> = await this.createQueryBuilder()
      .select('my_group_id')
      .where('group_id =:group_id and user_id =:user_id', {
        group_id: groupId,
        user_id: userId,
      })
      .andWhere('status = true')
      .execute();
    return result.length != 0;
  }

  public async findAllByStatusAndUserId(status: boolean, userId: number) {
    return await this.createQueryBuilder('my')
      .leftJoin('my.weekList', 'weekList')
      .leftJoin('my.group', 'group')
      .select(['my', 'group.title', 'group.category', 'weekList'])
      .where('user_id =:userId', { userId: userId })
      .andWhere('status =:status', { status: status })
      .getMany();
  }

  public async countAllCntAndDoneCntByStatusTrueAndUserId(
    userId: number,
  ): Promise<MyGroupDoneAndAllCnt> {
    return await this.createQueryBuilder('myGroup')
      .select('COUNT(*)', 'allCnt')
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(*)')
            .from(MyGroup, 'm')
            .where(
              'm.userId =:userId and m.isDone = true and m.status = true',
              { userId: userId },
            ),
        'doneCnt',
      )
      .where('myGroup.userId =:userId and myGroup.status = true', {
        userId: userId,
      })
      .select()
      .getRawOne();
  }

  public async findOneWithGroup(myGroupId: number): Promise<MyGroup> {
    return this.createQueryBuilder('mg')
      .leftJoinAndSelect('mg.group', 'g')
      .leftJoinAndSelect('mg.weekList', 'weekList')
      .where('mg.myGroupId =:myGroupId', { myGroupId: myGroupId })
      .getOne();
  }
}
