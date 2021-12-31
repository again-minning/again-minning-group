import { EntityRepository, Repository } from 'typeorm';
import { MyGroup } from '../../entities/my.group';

@EntityRepository(MyGroup)
export class MyGroupRepository extends Repository<MyGroup> {
  async existOnActive(groupId: number, userId: number): Promise<boolean> {
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
}
