import { Test, TestingModule } from '@nestjs/testing';
import { MyGroupService } from '../../src/my-group/my-group.service';

describe('MyGroupService', () => {
  let service: MyGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyGroupService],
    }).compile();

    service = module.get<MyGroupService>(MyGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
