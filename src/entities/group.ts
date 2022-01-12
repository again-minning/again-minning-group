import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MyGroup } from './my.group';
import { Image } from './image';
import { Category } from '../common/enum/category';
import { BadRequestException } from '@nestjs/common';
import { INVALID_TIME } from '../common/response/content/message.my-group';

@Entity()
export class Group {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'group_id' })
  groupId: number;

  @OneToMany(() => MyGroup, (myGroup) => myGroup.group)
  myGroupList: MyGroup[];

  @OneToMany(() => Image, (imageList) => imageList.group)
  imageList: Image[];

  @Column({ type: 'varchar' })
  category: Category;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'int' })
  memberCnt: number;

  @Column({ type: 'int' })
  avgRate: number;

  @Column({ type: 'text' })
  pictureDescription: string;

  @Column({ type: 'text' })
  ruleDescription: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  recommendation: string;

  @Column({ type: 'int' })
  todayCnt: number;

  @Column({ type: 'varchar' })
  startTime: string;

  @Column({ type: 'varchar' })
  endTime: string;

  @Column({ type: 'int' })
  endGroupTotalRate: number;

  @Column({ type: 'int' })
  endGroupTotalCnt: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public checkTime(): void {
    const dateTime = new Date().getTime();
    const startHour = parseInt(this.startTime.slice(0, 2));
    const endHour = parseInt(this.startTime.slice(0, 2));
    const startMin = parseInt(this.startTime.slice(3, 5));
    const endMin = parseInt(this.startTime.slice(3, 5));
    const startTime = new Date().setHours(startHour, startMin, 0, 0);
    const endTime = new Date().setHours(endHour, endMin, 0, 0);
    if (!(startTime <= dateTime && dateTime <= endTime)) {
      throw new BadRequestException(INVALID_TIME);
    }
  }
}
