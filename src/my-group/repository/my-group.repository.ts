import { EntityRepository, Repository } from 'typeorm';
import { MyGroup } from '../../entities/my.group';

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
}
