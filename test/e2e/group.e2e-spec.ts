import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import {
  ALL_GROUP_LIST,
  GROUP_DETAIL_E2E,
  HEALTH_GROUP_LIST,
} from '../template/group.template';
import { Connection, getConnection } from 'typeorm';
import { sqlGroup } from '../template/sql';

describe('GroupController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    const connection = moduleFixture.get(Connection);
    const runner = connection.createQueryRunner('master');
    await runner.query(sqlGroup);
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe('그룹_전체_조회_e2e', () => {
    it('/api/v1/group/0 (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/group/0')
        .expect(200)
        .expect(ALL_GROUP_LIST);
    });
  });

  describe('건강_그룹_전체_조회_e2e', () => {
    it('/api/v1/group/3 (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/group/3')
        .expect(200)
        .expect(HEALTH_GROUP_LIST);
    });
  });

  describe('그룹_상세_조회_e2e', () => {
    it('/api/v1/group/detail/1 (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/group/detail/1')
        .expect(200)
        .expect(GROUP_DETAIL_E2E);
    });
  });
});
