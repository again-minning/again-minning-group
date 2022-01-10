import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group';
import { MyGroup } from './my.group';

@Entity()
export class Image {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  imageId: number;

  @PrimaryColumn({ type: 'bigint', primary: true })
  userId: number;

  @ManyToOne(() => Group, (group) => group.imageList)
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'groupId' }])
  group: Group;

  @ManyToOne(() => MyGroup, (myGroup) => myGroup.imageList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'my_group_id', referencedColumnName: 'myGroupId' }])
  myGroup: MyGroup;

  @Column({ type: 'text', primary: true })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
