import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from '../../src/group/service/group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupRepository } from '../../src/group/repository/group.repository';
import {
  GROUP_DETAIL,
  groupAllList,
  groupListByHealth,
} from '../template/group.template';
import { NotFoundException } from '@nestjs/common';
import { ImageRepository } from '../../src/image/image.repository';

describe('GroupService', () => {
  let service: GroupService;
  let repository: GroupRepository;

  const mockGroupRepository = {
    findAll: jest.fn().mockResolvedValue(groupAllList),
    findAllByCategory: jest.fn().mockResolvedValue(groupListByHealth),
    findOne: jest
      .fn()
      .mockResolvedValueOnce(GROUP_DETAIL)
      .mockResolvedValueOnce(null),
  };

  const mockImageRepository = {
    findAllByGroupId: jest.fn().mockResolvedValue([{}, {}]), // 더미 이미지 2개
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(GroupRepository),
          useValue: mockGroupRepository,
        },
        {
          provide: getRepositoryToken(ImageRepository),
          useValue: mockImageRepository,
        },
      ],
    }).compile();
    service = module.get<GroupService>(GroupService);
    repository = module.get<GroupRepository>(GroupRepository);
  });

  describe('그룹_전체_조회', () => {
    it('모든 그룹을 응답해야 한다.', async () => {
      jest.spyOn(repository, 'findAll');
      const result = await service.getGroupList(0);
      expect(result.length).toEqual(2);
    });
  });

  describe('건강_카테고리_전체_조회', () => {
    it('카테고리가 건강인 모든 그룹을 조회한다.', async () => {
      jest.spyOn(repository, 'findAllByCategory');
      const result = await service.getGroupList(3);
      expect(result.length).toEqual(1);
      expect(result[0].title).toEqual('러닝하기');
    });
  });

  describe('그룹_상세_조회', () => {
    it('group_id가 1번인 그룹을 조회한다.', async () => {
      jest.spyOn(repository, 'findOne');
      const result = await service.getGroupDetail(1);
      expect(result.title).toEqual('하루 한 잔 물 마시기');
      expect(result.imageList.length).toEqual(2);
    });
  });

  describe('없은_그룹_조회', () => {
    it('없는 그룹을 조회하고 NotFoundException이 발생해야 한다.', () => {
      jest.spyOn(repository, 'findOne');
      expect(service.getGroupDetail(0)).rejects.toThrow(NotFoundException);
    });
  });
});
