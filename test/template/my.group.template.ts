import { Week } from '../../src/common/enum/week';
import { MyGroupRequest } from '../../src/my-group/dto/my.group.dto';
import { MyGroup } from '../../src/entities/my.group';
import { groupAllList } from './group.template';
import { MyGroupWeek } from '../../src/entities/my.group.week';

export const req = new MyGroupRequest();
req.groupId = 1;
req.userId = 2;
req.lastDate = new Date('2022-01-04');
req.weekList = [Week.SUN, Week.FRI];
req.alarmTime = null;
export const myGroup = new MyGroup();
myGroup.userId = 2;
myGroup.lastDate = new Date('2021-12-12');
myGroup.group = groupAllList[0];
export const myGroupWeek1 = new MyGroupWeek(myGroup, Week.SUN);
export const myGroupWeek2 = new MyGroupWeek(myGroup, Week.FRI);

export const req2 = new MyGroupRequest();
req2.groupId = 2;
req2.userId = 4;
req2.lastDate = new Date('2022-01-03');
req2.weekList = [Week.SUN, Week.FRI];
req2.alarmTime = null;
export const myGroup2 = new MyGroup();
myGroup2.userId = 4;
myGroup2.lastDate = new Date('2022-01-03');
myGroup2.group = groupAllList[1];
myGroup2.isDone = false;
myGroup2.weekList = [myGroupWeek1, myGroupWeek2];
export const mockFile = {
  originalname: 'sample.name',
  mimetype: 'sample.type',
  path: 'sample.url',
  buffer: Buffer.from('whatever'), // this is required since `formData` needs access to the buffer
  fieldname: 'a',
  encoding: '',
  size: 0,
  stream: null,
  destination: '',
  filename: '',
};
