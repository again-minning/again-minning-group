import { EntityRepository, Repository } from 'typeorm';
import { Image } from '../entities/image';
import { IMAGE_LIMIT } from '../common/constant/constant';
import { ImageDto } from './image.dto';
import { Order } from '../common/enum/Order';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  async findAllByGroupId(groupId: number, lastId = 0): Promise<ImageDto[]> {
    return this.createQueryBuilder('i')
      .select('i.imageId, i.url, i.createdAt')
      .leftJoin('i.group', 'g')
      .limit(IMAGE_LIMIT)
      .where('g.groupId =:groupId', { groupId: groupId })
      .andWhere('g.groupId >:lastId', { lastId: lastId })
      .orderBy('i.createdAt', 'DESC')
      .getRawMany();
  }

  async findAllByMyGroupId(
    myGroupId: number,
    lastId = 0,
    order = Order.DESC,
  ): Promise<ImageDto[]> {
    return this.createQueryBuilder('i')
      .select('i.imageId, i.url, i.createdAt')
      .leftJoin('i.myGroup', 'mg')
      .limit(IMAGE_LIMIT)
      .where('mg.myGroupId =:myGroupId', { myGroupId: myGroupId })
      .andWhere('i.imageId >:lastId', { lastId: lastId })
      .orderBy('i.createdAt', order)
      .getRawMany();
  }

  async findAllByUserIdAndGroupId(
    userId: number,
    myGroupId: number,
    lastId = 0,
    order = Order.DESC,
  ): Promise<ImageDto[]> {
    return this.createQueryBuilder('i')
      .select('i.imageId, i.url, i.createdAt')
      .leftJoin('i.myGroup', 'mg')
      .limit(IMAGE_LIMIT)
      .where('i.userId =:userId', { userId: userId })
      .andWhere('mg.myGroupId =:myGroupId', { myGroupId: myGroupId })
      .andWhere('i.imageId >:lastId', { lastId: lastId })
      .orderBy('i.createdAt', order)
      .getRawMany();
  }
}
