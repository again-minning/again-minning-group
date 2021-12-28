import { Group } from '../../src/entities/group';

const group1 = new Group();
const group2 = new Group();
group1.groupId = 1;
group1.title = '러닝하기';
group1.category = 3;
group2.groupId = 2;
group2.category = 4;

export const groupAllList: Group[] = [group1, group2];
export const groupListByHealth: Group[] = [group1];
export const ALL_GROUP_LIST = {
  message: {
    status: 200,
    message: '그룹 조회를 정상적으로 수행하였습니다.',
  },
  data: [
    {
      title: '하루 한 잔 물 마시기',
      avgRate: 0,
      memberCnt: 12,
      category: '4',
    },
    {
      title: '아침에 일어나서 러닝하기',
      avgRate: 0,
      memberCnt: 4,
      category: '3',
    },
  ],
};
export const HEALTH_GROUP_LIST = {
  message: {
    status: 200,
    message: '그룹 조회를 정상적으로 수행하였습니다.',
  },
  data: [
    {
      title: '아침에 일어나서 러닝하기',
      avgRate: 0,
      memberCnt: 4,
      category: '3',
    },
  ],
};
