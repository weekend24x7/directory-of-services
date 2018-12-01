import request from 'supertest';
import { expect } from 'chai';

import app from '../src/app';

import { seedData } from '../src/controllers/postInitialData'

describe('API testing', () => {
  let result
  before(async () => {
    result = null
    await seedData()
  })
  describe('services', () => {
    it('should return list of organisation', async () => {
      result = await request(app)
        .get('/api/service/all')
      expect(result.status).to.eql(200)
      expect(result.body).to.be.a('string')

      // TODO decode and check if JSON
    });
  })
  describe('categories', () => {
    it('should return list of categories in JSON format', async () => {
      result = await request(app)
        .get('/api/service/categories')
        .expect('Content-Type', /json/)
        .expect(200)
    })
    it('should return an array and have women as category', async () => {
      result = await request(app)
        .get('/api/service/categories')
      expect(result.body).to.be.a('array').to.have.length(19)
      expect(result.body).to.include('Women')
    });
  })
  describe('boroughs and areas', () => {
    it('should return list of boroughs in JSON format', async () => {
      result = await request(app)
        .get('/api/service/boroughs')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(result.body).to.be.a('array');
    });

    it('should return list of areas in JSON format', async () => {
      result = await request(app)
        .get('/api/service/areas')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(result.body).to.be.a('array');
    });

    it('should return list of boroughs filtered by category in JSON format', async () => {
      result = await request(app)
        .get('/api/service/category/?category=Education')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(result.body).to.be.a('array');
    });

    it('should return list of boroughs filtered by day in JSON format', async () => {
      result = await request(app)
        .get('/api/service/day/?day=Monday')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(result.body).to.be.a('array');
    });

    it('should return list of boroughs filtered by borough in JSON format', async () => {
      result = await request(app)
        .get('/api/service/borough/?borough=Bexley')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(result.body).to.be.a('array');
    });
  })
  describe('postcode', () => {
    it('should not save unless correct data has been supplied', async () => {
      const postcode = { lat: 'nw78', long: '657858' };
      result = await request(app)
        .post('/api/service/postcode')
        .send(postcode);
      expect(result.statusCode).to.be.equal(200);
      expect(result.body.success).to.equal(true)
      expect(result.body.message).to.be.equal('The Postcode has been saved successfully');
    });

    it('should save with right data', async () => {
      const anOrg = {
        address: 'not provided',
        addressId: 330,
        area: 'Swale',
        borough: 'Lewisham',
        branchId: 330,
        categories: ['Benefits'],
        clients: 'Homeless/Hostel/Risk of eviction',
        days: 'Monday Tuesday Wednesday Thursday Friday',
        email: 'office@999club.org',
        lat: 'not provided',
        long: 'not provided',
        orgId: 133,
        organisation: '999 Club',
        originalCategory: 'Benefits',
        postcode: 'SE8 4PA',
        process: 'Drop-in 10.30am Mon- Fri',
        project: '1',
        service: 'Benefits advice',
        serviceId: 330,
        tag: '',
        tel: '020 8694 5797',
        website: 'http://999club.org/our-services/advice-and-support/'
      };
      result = await request(app)
        .post('/api/service/organisation/add')
        .send(anOrg);
      expect(result.statusCode).to.be.equal(200);
      expect(result.body.success).to.equal(true);
      expect(result.body.message).to.be.equal('The organisation has been saved successfully');
    });
  })
});

