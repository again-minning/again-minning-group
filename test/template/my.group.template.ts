import { Week } from '../../src/common/enum/week';
import { MyGroupRequest } from '../../src/my-group/dto/my.group.dto';
import { MyGroup } from '../../src/entities/my.group';
import { groupAllList } from './group.template';
import { MyGroupWeek } from '../../src/entities/my.group.week';

export const req = new MyGroupRequest();
req.groupId = 1;
req.userId = 2;
req.lastDate = new Date('2021-12-12');
req.weekList = [Week.WED, Week.FRI];
req.alarmTime = null;

export const myGroup = new MyGroup();
myGroup.userId = 2;
myGroup.lastDate = new Date('2021-12-12');
myGroup.group = groupAllList[0];
export const myGroupWeek1 = new MyGroupWeek(myGroup, Week.WED);
export const myGroupWeek2 = new MyGroupWeek(myGroup, Week.FRI);
