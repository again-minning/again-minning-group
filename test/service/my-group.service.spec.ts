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
  mockFile,
  myGroup,
  myGroup2,
  myGroupWeek1,
  myGroupWeek2,
  req,
} from '../template/my.group.template';
import { MyGroup } from '../../src/entities/my.group';
import { Week } from '../../src/common/enum/week';
import {
  INVALID_DATE,
  INVALID_IMAGE,
  INVALID_MY_GROUP_ID,
  INVALID_TIME,
  IS_DONE,
  MY_GROUP_NOT_FOUND,
} from '../../src/common/response/content/message.my-group';
import { ImageRepository } from '../../src/image/image.repository';

describe('MyGroupService', () => {
  let myGroupService: MyGroupService;
  let connection: Connection;

  const mockMyGroupRepository = {
    existOnActive: jest
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false),
    save: jest.fn().mockResolvedValue(myGroup),
    create: jest.fn(),
    findOne: jest.fn().mockResolvedValue(myGroup2),
  };
  const mockGroupRepository = {
    existById: jest.fn().mockResolvedValueOnce(true),
  };
  const mockMyGroupWeekRepository = {
    save: jest.fn().mockResolvedValue([myGroupWeek1, myGroupWeek2]),
    create: jest.fn(),
  };

  const mockImageRepository = {
    findAllByGroupId: jest.fn().mockResolvedValue([{}, {}]), // 더미 이미지 2개
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
          provide: getRepositoryToken(ImageRepository),
          useValue: mockImageRepository,
        },
        {
          provide: getRepositoryToken(MyGroupWeek),
          useValue: mockMyGroupWeekRepository,
        },
        { provide: Connection, useValue: mockConnection() },
      ],
    }).compile();

    myGroupService = module.get<MyGroupService>(MyGroupService);
    connection = module.get<Connection>(Connection);
  });

  it('진행중인_my_group_존재하는_경우', () => {
    expect(myGroupService['checkIsExistOnActive'](1, 2)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('요청_값으로_MyGroup_객체_생성_테스트', async () => {
    const res = await myGroupService.createMyGroup(
      req,
      connection.createQueryRunner().manager,
    );
    expect(res.userId).toEqual(2);
    expect(res.weekList[0]).toEqual(Week.SUN);
    expect(res.groupId).toEqual(1);
  });

  it('수행시간이_아닌_경우_테스트', () => {
    const date = new Date();
    date.setHours(7, 19, 0, 0);
    jest.useFakeTimers('modern');
    jest.setSystemTime(date.getTime());
    try {
      myGroup2.group.checkTime();
    } catch (err) {
      expect(err).toEqual(new BadRequestException(INVALID_TIME));
    }
  });

  it('수행요일이_아닌_경우_테스트', () => {
    const date = new Date('2022-01-02T06:00:00.000');
    try {
      myGroupService['checkDayIsInclude'](date, [Week.WED]);
    } catch (err) {
      expect(err).toEqual(new BadRequestException(INVALID_DATE));
    }
  });

  it('이미_수행한_경우_테스트', () => {
    try {
      myGroup2.isDone = true;
      myGroupService['checkIsDone'](myGroup2);
    } catch (err) {
      expect(err).toEqual(new BadRequestException(IS_DONE));
    }
  });

  it('이미지가_없는_경우_테스트', () => {
    try {
      myGroupService['checkFileIsNotNull'](mockFile);
    } catch (err) {
      expect(err).toEqual(new BadRequestException(INVALID_IMAGE));
    }
  });

  it('나의그룹_없는_경우_테스트', () => {
    try {
      myGroupService['checkIsNotNull'](null);
    } catch (err) {
      expect(err).toEqual(new BadRequestException(MY_GROUP_NOT_FOUND));
    }
  });

  it('나의그룹이_아닌_경우_테스트', () => {
    try {
      myGroupService['checkIsMine'](myGroup2, 2); // myGroup2.userId = 4
    } catch (err) {
      expect(err).toEqual(new BadRequestException(INVALID_MY_GROUP_ID));
    }
  });
});
