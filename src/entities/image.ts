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
  @PrimaryColumn({ type: 'bigint' })
  userId: number;

  @ManyToOne(() => Group, (group) => group.imageList, { primary: true })
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'groupId' }])
  group: number;

  @ManyToOne(() => MyGroup, (myGroup) => myGroup.imageList, { primary: true })
  @JoinColumn([{ name: 'my_group_id', referencedColumnName: 'myGroupId' }])
  myGroup: number;

  @Column({ type: 'text' })
  url: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
