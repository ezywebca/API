import { app, AuthClient } from '../../src/api/server';
import request from 'supertest';
import { BotDocument, SavedBot } from '../../src/data/models/bot';
import { assert, expect } from 'chai';
import { getObj } from '../test-utils';
import '../mocks';
import { SavedBotToken } from '../../src/data/models/bot-token';

describe('routes/api/bots/manage-bot-routes', () => {
  let savedBot: BotDocument;
  const key = 'password_123';
	const botId = 'bot_user_123';
	const endpoint = '/api/v1';

  beforeEach(async () => {
    savedBot = await SavedBot.create({
      _id: botId,
      body: {
        body: 'My name jeff 123',
        botId,
        githubURL: '',
        invite: '1927uhsd',
        overview: 'The best bot the world has ever seen',
        ownerId: 'test_user_123',
        prefix: '.',
        supportInvite: '289u138',
        tags: [],
        websiteURL: ''
      }
    });

    await SavedBotToken.create({
      _id: 'bot_user_123',
      token: 'secure_api_key_123'
    });
  });

  after(async() => {
		await SavedBot.deleteMany({});
		await SavedBotToken.deleteMany({});
	});	
  
  describe('POST /bots', () => {
    it('user not logged in, status 401', (done) => {
      request(app)
        .post(`${endpoint}/bots`)
        .expect(401)
        .end(done);
    });

    it('user adds a non bot user, sends 400', (done) => {
      request(app)
        .post(`${endpoint}/bots`)
        .set({ Authorization: key })
        .send({ botId: 'test_user_123' })
        .expect(400)
        .end(done);
    });

    it('user logged in, and valid body, sends new bot', (done) => {
      request(app)
        .post(`${endpoint}/bots`)
        .set({ Authorization: key })
        .send(savedBot.listing)
        .expect(201)
        .expect(res => assert(
          getObj(res.body) === getObj(savedBot.toJSON()),
          'Saved bot must deep equal res body.'
        ))
        .end(done);
    });
  });

  describe('PATCH /bots/:id', () => {
    it('user not logged in, status 401', (done) => {
      request(app)
        .patch(`${endpoint}/bots/${botId}`)
        .expect(401)
        .end(done);
    });

    it('bot not found, status 404', (done) => {
      request(app)
        .patch(`/api/bots/23u981ji973yg1381t623871t237183`)
        .set({ Authorization: key })
        .expect(404)
        .end(done);
    });

    it('valid body, sends updated bot', (done) => {
      request(app)
        .patch(`${endpoint}/bots/${botId}`)
        .send(savedBot.listing)
        .expect(200)
        .expect(res => assert(
          getObj(res.body) === getObj(savedBot),
          'Updated bot must equal saved bot.'
        ))
        .end(done);
    });
  });
});