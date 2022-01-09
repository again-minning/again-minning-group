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

export const detailResult = {
  message: {
    status: 200,
    message: '나의 그룹 디페일 페이지를 정상적으로 조회하였습니다.',
  },
  data: {
    title: '아침에 일어나서 러닝하기',
    memberCnt: 4,
    avgRate: 0,
    description: '아침마다 러닝을 하는 그룹',
    recommendation: '하루 한 번 달리기를 해보세요',
    pictureDescription: '러닝하는 사진',
    ruleDescription: '최소 1KM를 뛰어주세요.',
    todayCnt: 3,
    myRate: 0,
    dayList: ['0', '5'],
    lateDate: '2022-01-04',
    alarmTime: '7',
    imageList: [
      {
        image_id: '2',
        url: 'b',
        created_at: '2021-12-25T13:47:34.163Z',
      },
      {
        image_id: '1',
        url: 'a',
        created_at: '2021-12-24T13:47:34.163Z',
      },
    ],
  },
};
