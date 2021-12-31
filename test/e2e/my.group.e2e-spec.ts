import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { req } from '../template/my.group.template';
import { Connection, getConnection } from 'typeorm';
import { sqlGroup } from '../template/sql';

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
});
