import { Test, TestingModule } from '@nestjs/testing';
import { MyGroupController } from '../../src/my-group/controller/my-group.controller';
import { MyGroupService } from '../../src/my-group/service/my-group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MyGroupRepository } from '../../src/my-group/repository/my-group.repository';
import { Connection } from 'typeorm';
import { GroupService } from '../../src/group/service/group.service';
import { MyGroupWeek } from '../../src/entities/my.group.week';
import { GroupRepository } from '../../src/group/repository/group.repository';
import { ImageRepository } from '../../src/image/image.repository';

describe('MyGroupController', () => {
  let controller: MyGroupController;

  const mockRepository = {};
  const mockConnect = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyGroupService,
        GroupService,
        {
          provide: getRepositoryToken(MyGroupRepository),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(MyGroupWeek),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(GroupRepository),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ImageRepository),
          useValue: mockRepository,
        },
        {
          provide: Connection,
          useValue: mockConnect,
        },
      ],
      controllers: [MyGroupController],
    }).compile();

    controller = module.get<MyGroupController>(MyGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
