import { Category } from '../../common/enum/category';
import { Group } from '../../entities/group';
import { Image } from '../../entities/image';

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

export class GroupDetail {
  constructor(group: Group, imageList: ImageDto[]) {
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
    this.imageList = imageList;
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
  imageList: ImageDto[];
}

export class ImageDto {
  constructor(image: Image) {
    this.imageId = image.imageId;
    this.url = image.url;
    this.createdAt = image.createdAt;
  }
  imageId: number;
  url: string;
  createdAt: string;
}
