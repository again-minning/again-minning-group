import { EntityRepository, Repository } from 'typeorm';
import { Group } from '../../entities/group';
import { Category } from '../../common/enum/category';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  async findAll(): Promise<Group[]> {
    return this.createQueryBuilder().select().getMany();
  }

  async findAllByCategory(category: Category): Promise<Group[]> {
    return this.createQueryBuilder()
      .where('category =:category', { category: category })
      .getMany();
  }

  async findById(id: number): Promise<Group> {
    return this.createQueryBuilder('group')
      .whereInIds(id)
      .leftJoinAndSelect('group.imageList', 'imageList')
      .getOne();
  }

  async existById(id: number): Promise<boolean> {
    const result: Array<object> = await this.createQueryBuilder()
      .select('group_id')
      .where('group_id =:id', { id: id })
      .execute();
    return result.length != 0;
  }
}
