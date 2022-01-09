import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { detailResult, req, req2 } from '../template/my.group.template';
import { Connection, getConnection } from 'typeorm';
import {
  sqlGroup,
  sqlImage,
  sqlMyGroup,
  sqlMyGroupWeek,
} from '../template/sql';

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
    await runner.query(sqlMyGroupWeek);
    await runner.query(sqlImage);
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

  describe('오늘_내_그룹_수행현황_조회_e2e', () => {
    it('/api/v1/my-group/day/status?userId=4 (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/my-group/day/status?userId=4')
        .expect({
          message: {
            status: 200,
            message: '나의 그룹 오늘 수행 현황을 정상적으로 조회하였습니다.',
          },
          data: {
            allCnt: '1',
            doneCnt: '0',
          },
        })
        .expect(200);
    });
  });

  describe('내_그룹_상세조회_성공_e2e', () => {
    it('/api/v1/my-group/detail?myGroupId=2 (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/my-group/detail?myGroupId=2')
        .expect(detailResult)
        .expect(200);
    });
  });
});
