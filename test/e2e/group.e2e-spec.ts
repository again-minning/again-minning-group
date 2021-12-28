import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ALL_GROUP_LIST, HEALTH_GROUP_LIST } from '../template/group.template';

describe('GroupController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/group/0 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/group/0')
      .expect(200)
      .expect(ALL_GROUP_LIST);
  });

  it('/api/v1/group/0 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/group/3')
      .expect(200)
      .expect(HEALTH_GROUP_LIST);
  });
});
