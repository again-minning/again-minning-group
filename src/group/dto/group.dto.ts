import { ResponseMessage } from '../../common/response/response.message';
import { Category } from '../../common/enum/category';
import { Group } from '../../entities/group';
import { HttpStatus } from '@nestjs/common';
import { GROUP_OK } from '../../common/response/content/message.group';

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
