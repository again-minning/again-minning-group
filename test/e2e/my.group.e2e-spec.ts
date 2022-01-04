import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { req, req2 } from '../template/my.group.template';
import { Connection, getConnection } from 'typeorm';
import { sqlGroup, sqlMyGroup } from '../template/sql';

describe('MyGroupController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    const connection = moduleFixture.get(Connection);
    const runner = connection.createQueryRunner('master');
    await runner.query(sqlGroup);
    await runner.query(sqlMyGroup);
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe('그룹_참여_e2e', () => {
    it('/api/v1/my-group/ (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/my-group/')
        .send(req)
        .expect(201);
    });
  });

  describe('내_그룹_조회_잘못된_query_요청_e2e', () => {
    it('/api/v1/my-group/all?active=asd&userId=2 (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/my-group/all?active=asd&userId=2')
        .expect(400);
    });
  });

  describe('내_그룹_수행_인증_요청_e2e', () => {
    const hour = new Date().getHours();
    if (!(hour <= 8 && hour >= 5)) {
      it('수행 시간이 아닌 케이스\n/api/v1/my-group/done?myGroupId=2&userId=4 (POST)', () => {
        return request(app.getHttpServer())
          .post('/api/v1/my-group/done?myGroupId=2&userId=4')
          .send(req2)
          .expect(400);
      });
    } else {
      it('정상 인증 케이스\n/api/v1/my-group/done?myGroupId=2&userId=4 (POST)', () => {
        return request(app.getHttpServer())
          .post('/api/v1/my-group/done?myGroupId=2&userId=4')
          .send(req2)
          .expect(200);
      });
    }
  });
});
