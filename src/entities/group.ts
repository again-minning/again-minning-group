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

@Entity()
export class Group {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'group_id' })
  groupId: number;

  @OneToMany(() => MyGroup, (myGroup) => myGroup.group)
  myGroupList: MyGroup[];

  @OneToMany(() => Image, (imageList) => imageList.group)
  imageList: Image[];

  @Column({ type: 'varchar' })
  category: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
