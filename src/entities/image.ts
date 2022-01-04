import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group';
import { MyGroup } from './my.group';

@Entity()
export class Image {
  @PrimaryColumn({ type: 'bigint', primary: true })
  userId: number;

  @ManyToOne(() => Group, (group) => group.imageList, { primary: true })
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'groupId' }])
  group: Group;

  @ManyToOne(() => MyGroup, (myGroup) => myGroup.imageList, { primary: true })
  @JoinColumn([{ name: 'my_group_id', referencedColumnName: 'myGroupId' }])
  myGroup: MyGroup;

  @Column({ type: 'text', primary: true })
  url: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
