import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from '../../src/group/service/group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupRepository } from '../../src/group/repository/group.repository';
import { groupAllList, groupListByHealth } from '../template/group.template';

describe('GroupService', () => {
  let service: GroupService;
  let repository: GroupRepository;

  const mockRepository = {
    findAll: jest.fn().mockResolvedValue(groupAllList),
    findAllByCategory: jest.fn().mockResolvedValue(groupListByHealth),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(GroupRepository),
          useValue: mockRepository,
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
      expect(result.data.length).toEqual(2);
    });
  });

  describe('건강_카테고리_전체_조회', () => {
    it('카테고리가 건강인 모든 그룹을 조회한다.', async () => {
      jest.spyOn(repository, 'findAllByCategory');
      const result = await service.getGroupList(3);
      expect(result.data.length).toEqual(1);
      expect(result.data[0].title).toEqual('러닝하기');
    });
  });
});