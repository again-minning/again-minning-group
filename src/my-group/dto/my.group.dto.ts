import { Week } from '../../common/enum/week';
import { MyGroup } from '../../entities/my.group';
import { MyGroupWeek } from '../../entities/my.group.week';
import { Category } from '../../common/enum/category';
import { ResponseMessage } from '../../common/response/response.message';
import { ImageDto } from '../../image/image.dto';

export class MyGroupRequest {
  groupId: number;
  userId: number;
  lastDate: Date;
  weekList: Week[];
  alarmTime?: string;
}

export class MyGroupCreateResponse {
  constructor(message: ResponseMessage, data: MyGroupCreate) {
    this.message = message;
    this.data = data;
  }
  message: ResponseMessage;
  data: MyGroupCreate;
}

export class MyGroupCreate {
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

export class MyGroupSimple {
  constructor(data: MyGroup, rate: number) {
    this.myGroupId = data.myGroupId;
    this.title = data.group.title;
    this.rate = rate;
    this.weekList = data.weekList.map((week) => week.week);
    this.category = data.group.category;
    this.status = data.status;
    this.isDone = data.isDone;
    this.lastDate = data.lastDate;
  }
  myGroupId: number;
  title: string;
  rate: number;
  weekList: Week[];
  category: Category;
  status: boolean;
  isDone: boolean;
  lastDate: Date;
}

export class MyGroupDoneAndAllCnt {
  allCnt: number;
  doneCnt: number;
}

export class MyGroupDetail {
  constructor(myGroup: MyGroup, imageList: ImageDto[]) {
    this.title = myGroup.group.title;
    this.memberCnt = myGroup.group.memberCnt;
    this.avgRate = myGroup.group.avgRate;
    this.description = myGroup.group.description;
    this.recommendation = myGroup.group.recommendation;
    this.pictureDescription = myGroup.group.pictureDescription;
    this.ruleDescription = myGroup.group.ruleDescription;
    this.todayCnt = myGroup.group.todayCnt;
    this.myRate = myGroup.rate;
    this.dayList = myGroup.weekList.map((myWeek) => myWeek.week);
    this.startDate = myGroup.createdAt;
    this.lateDate = myGroup.lastDate;
    this.alarmTime = myGroup.alarmTime;
    this.imageList = imageList;
  }
  title: string;
  memberCnt: number;
  avgRate: number;
  description: string;
  recommendation: string;
  pictureDescription: string;
  ruleDescription: string;
  dayList: Week[];
  todayCnt: number;
  myRate: string;
  startDate: Date;
  lateDate: Date;
  alarmTime: string;
  imageList: ImageDto[];
}
