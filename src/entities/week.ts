import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MyGroup } from './my.group';

@Entity()
export class Week {
  @ManyToOne(() => MyGroup, (myGroup) => myGroup.weekList, { primary: true })
  @JoinColumn([{ name: 'my_group_id', referencedColumnName: 'myGroupId' }])
  myGroup: MyGroup;
}
