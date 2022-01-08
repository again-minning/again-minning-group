import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MyGroup } from './my.group';
import { Week } from '../common/enum/week';

@Entity()
export class MyGroupWeek {
  constructor(myGroup: MyGroup, week: Week) {
    this.myGroup = myGroup;
    this.week = week;
  }

  @ManyToOne(() => MyGroup, (myGroup) => myGroup.weekList, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'my_group_id', referencedColumnName: 'myGroupId' }])
  myGroup: MyGroup;

  @PrimaryColumn('varchar')
  week: Week;
}
