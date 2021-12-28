import { Test, TestingModule } from '@nestjs/testing';
import { MyGroupController } from '../../src/my-group/my-group.controller';

describe('MyGroupController', () => {
  let controller: MyGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyGroupController],
    }).compile();

    controller = module.get<MyGroupController>(MyGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
