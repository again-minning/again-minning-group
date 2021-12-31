import { Week } from '../../common/enum/week';
import { MyGroup } from '../../entities/my.group';
import { MyGroupWeek } from '../../entities/my.group.week';

export class MyGroupRequest {
  groupId: number;
  userId: number;
  lastDate: Date;
  weekList: Week[];
  alarmTime?: string;
}

export class MyGroupResponse {
  constructor(myGroup: MyGroup, weekList: MyGroupWeek[]) {
    this.groupId = myGroup.group.groupId;
    this.userId = myGroup.userId;
    this.myGroupId = myGroup.myGroupId;
    this.lastDate = myGroup.lastDate;
    this.alarmTime = myGroup.alarmTime;
    this.weekList = weekList.map((myGroupWeek) => myGroupWeek.week);
    this.rate = myGroup.rate;
  }
  groupId: number;
  userId: number;
  myGroupId: number;
  lastDate: Date;
  alarmTime: string;
  weekList: Week[];
  rate: number;
}
