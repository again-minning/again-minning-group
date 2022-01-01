import { Week } from '../../common/enum/week';
import { MyGroup } from '../../entities/my.group';
import { MyGroupWeek } from '../../entities/my.group.week';
import { Category } from '../../common/enum/category';
import { ResponseMessage } from '../../common/response/response.message';

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

export class MyGroupSimpleResponse {
  constructor(message: ResponseMessage, data: MyGroupSimple[]) {
    this.message = message;
    this.data = data;
  }
  message: ResponseMessage;
  data: MyGroupSimple[];
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
