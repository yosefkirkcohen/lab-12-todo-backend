require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('posts todo', async() => {

      const expectation = [
        {
          id: expect.any(Number),
          todo: 'Bamalam',
          completed: false,
          owner_id: expect.any(Number)
        }
      ];

      const data = await fakeRequest(app)
        .post('/api/todos')
        .send({
          todo: 'Bamalam'
        })
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('gets todo', async() => {

      const expectation = [
        {
          id: expect.any(Number),
          todo: 'Bamalam',
          completed: false,
          owner_id: expect.any(Number)
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expect.arrayContaining(expectation));
    });

    test('update todo', async() => {

      const expectation = [
        {
          id: expect.any(Number),
          todo: 'Bamalam',
          completed: true,
          owner_id: expect.any(Number)
        }
      ];

      const data = await fakeRequest(app)
        .put('/api/todos/4')
        .send({
          completed: true
        })
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
