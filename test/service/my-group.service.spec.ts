import { Test, TestingModule } from '@nestjs/testing';
import { MyGroupService } from '../../src/my-group/service/my-group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MyGroupRepository } from '../../src/my-group/repository/my-group.repository';
import { GroupRepository } from '../../src/group/repository/group.repository';
import { MyGroupWeek } from '../../src/entities/my.group.week';
import { Connection } from 'typeorm';
import { GroupService } from '../../src/group/service/group.service';
import { BadRequestException } from '@nestjs/common';
import {
  myGroup,
  myGroupWeek1,
  myGroupWeek2,
  req,
} from '../template/my.group.template';
import { MyGroup } from '../../src/entities/my.group';
import { Week } from '../../src/common/enum/week';

describe('MyGroupService', () => {
  let myGroupService: MyGroupService;

  const mockMyGroupRepository = {
    existOnActive: jest
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false),
    save: jest.fn().mockResolvedValue(myGroup),
    create: jest.fn(),
  };
  const mockGroupRepository = {
    existById: jest
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true),
  };
  const mockMyGroupWeekRepository = {
    save: jest.fn().mockResolvedValue([myGroupWeek1, myGroupWeek2]),
    create: jest.fn(),
  };

  const mockConnection = () => ({
    transaction: jest.fn(),
    createQueryRunner: () => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: (r) => r,
        getRepository: (r) => {
          if (r == MyGroup) {
            return mockMyGroupRepository;
          } else if (r == MyGroupWeek) {
            return mockMyGroupWeekRepository;
          }
        },
      },
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyGroupService,
        GroupService,
        {
          provide: getRepositoryToken(MyGroupRepository),
          useValue: mockMyGroupRepository,
        },
        {
          provide: getRepositoryToken(GroupRepository),
          useValue: mockGroupRepository,
        },
        {
          provide: getRepositoryToken(MyGroupWeek),
          useValue: mockMyGroupWeekRepository,
        },
        { provide: Connection, useValue: mockConnection() },
      ],
    }).compile();

    myGroupService = module.get<MyGroupService>(MyGroupService);
  });

  it('그룹이_존재하지_않는_경우', () => {
    expect(myGroupService['isGroup'](2)).rejects.toThrow(BadRequestException);
  });

  it('진행중인_my_group_존재하는_경우', () => {
    expect(myGroupService['checkIsExistOnActive'](1, 2)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('요청_값으로_MyGroup_객체_생성_테스트', async () => {
    const res = await myGroupService.createMyGroup(req);
    expect(res.data.userId).toEqual(2);
    expect(res.data.weekList[0]).toEqual(Week.WED);
    expect(res.data.groupId).toEqual(1);
  });
});
