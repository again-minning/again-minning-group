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

  @OneToMany(() => Image, (imageList) => imageList.myGroup, {
    onDelete: 'CASCADE',
  })
  imageList: Image[];

  @OneToMany(() => MyGroupWeek, (weekList) => weekList.myGroup, {
    onDelete: 'CASCADE',
  })
  weekList: MyGroupWeek[];

  @ManyToOne(() => Group, (group) => group.myGroupList, { cascade: ['update'] })
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'groupId' }])
  group: Group;

  @Column({ type: 'int' })
  successCnt;

  @Column({ type: 'int' })
  totalDateCnt;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'date' })
  lastDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  alarmTime: string;

  @Column({ type: 'int' })
  rate;

  @Column({ type: 'boolean' })
  status;

  @Column({ type: 'boolean' })
  isDone;

  public doneDayMyGroup(): void {
    this.isDone = true;
    this.successCnt += 1;
    this.group.todayCnt += 1;
  }
}
