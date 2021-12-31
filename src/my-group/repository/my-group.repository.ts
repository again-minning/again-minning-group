import { EntityRepository, Repository } from 'typeorm';
import { MyGroup } from '../../entities/my.group';

@EntityRepository(MyGroup)
export class MyGroupRepository extends Repository<MyGroup> {}
