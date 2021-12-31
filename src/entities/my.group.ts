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
import { MyGroupWeek } from './my.group.week';

@Entity()
export class MyGroup {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'my_group_id' })
  myGroupId: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @OneToMany(() => Image, (imageList) => imageList.myGroup)
  imageList: Image[];

  @OneToMany(() => MyGroupWeek, (weekList) => weekList.myGroup)
  weekList: MyGroupWeek[];

  @ManyToOne(() => Group, (group) => group.myGroupList)
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'groupId' }])
  group: Group;

  @Column({ type: 'int' })
  successCnt = 0;

  @Column({ type: 'int' })
  totalDateCnt = 0;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'date' })
  lastDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  alarmTime: string;

  @Column({ type: 'int' })
  rate = 0;

  @Column({ type: 'boolean' })
  status = true;
}
