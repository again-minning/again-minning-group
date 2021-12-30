import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from '../../src/group/controller/group.controller';
import { GroupService } from '../../src/group/service/group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupRepository } from '../../src/group/repository/group.repository';

describe('GroupController', () => {
  let controller: GroupController;

  const mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(GroupRepository),
          useValue: mockRepository,
        },
      ],
      controllers: [GroupController],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
