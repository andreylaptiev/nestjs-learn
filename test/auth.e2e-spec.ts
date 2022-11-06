import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'test@mail.com';

    return request(app.getHttpServer())
      .post('/users/auth/signup')
      .send({ email, password: 'qwerty' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signs up a new user and returns currently logged in user', async () => {
    const email = 'test@mail.com';

    const res = await request(app.getHttpServer())
      .post('/users/auth/signup')
      .send({ email, password: 'qwerty' })
      .expect(201);

    // get cookie value from Set-Cookie header of signup response
    const cookie = res.get('Set-Cookie');

    // send Cookie header with GET request to whoami
    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Cookie', cookie)
      .expect(200);

    // compare email returned by whoami route and signup email
    expect(body.email).toEqual(email);
  });
});
