import { ResponseMessage } from '../../common/response/response.message';
import { Category } from '../../common/enum/category';
import { Group } from '../../entities/group';
import { HttpStatus } from '@nestjs/common';
import { GROUP_OK } from '../../common/response/content/message.group';
import { Image } from '../../entities/image';

export class GroupResponseListDto {
  constructor(groupList: Group[]) {
    this.message = new ResponseMessage(HttpStatus.OK, GROUP_OK);
    this.data = groupList.map((x) => new GroupResponseDto(x));
  }
  message: ResponseMessage;
  data: GroupResponseDto[];
}

export class GroupResponseDto {
  constructor(group: Group) {
    this.title = group.title;
    this.avgRate = group.avgRate;
    this.memberCnt = group.memberCnt;
    this.category = group.category;
  }
  title: string;
  avgRate: number;
  memberCnt: number;
  category: Category;
}

export class GroupDetailDto {
  constructor(group: Group) {
    this.groupId = group.groupId;
    this.category = group.category;
    this.title = group.title;
    this.memberCnt = group.memberCnt;
    this.avgRate = group.avgRate;
    this.pictureDescription = group.pictureDescription;
    this.ruleDescription = group.ruleDescription;
    this.description = group.description;
    this.recommendation = group.recommendation;
    this.todayCnt = group.todayCnt;
    this.imageList = group.imageList;
  }
  groupId: number;
  category: Category;
  title: string;
  memberCnt: number;
  avgRate: number;
  pictureDescription: string;
  ruleDescription: string;
  description: string;
  recommendation: string;
  todayCnt: number;
  imageList: Image[];
}
