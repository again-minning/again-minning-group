import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group';
import { Image } from './image';
import { Week } from './week';

@Entity()
export class MyGroup {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'my_group_id' })
  myGroupId: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @OneToMany(() => Image, (imageList) => imageList.myGroup)
  imageList: Image[];

  @OneToMany(() => Week, (weekList) => weekList.myGroup)
  weekList: Week[];

  @ManyToOne(() => Group, (group) => group.myGroupList)
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'groupId' }])
  group: Group;

  @Column({ type: 'int' })
  successCnt: number;

  @Column({ type: 'int' })
  totalDateCnt: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'date' })
  lastDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar' })
  alarm_time: string;

  @Column({ type: 'int' })
  rate: number;
}
