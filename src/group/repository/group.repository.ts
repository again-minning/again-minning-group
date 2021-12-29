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
}
