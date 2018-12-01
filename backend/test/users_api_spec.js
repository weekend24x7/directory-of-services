
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app';

describe('Users API testing', () => {

  it('should add new user', async () => {
    const userData = {
      orgName: 'CYF',
      password: '1234',
      fullname: 'Mohammed',
      email: 'test@testtwo.com'
    }
    const result = await request(app).post('/api/users')
      .send(userData)
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('object')
    expect(result.statusCode).to.equal(200)
    expect(result.body.fullname).to.equal(userData.fullname)
  })

  it('should return list of users', async () => {
    const result = await request(app).get('/api/users')
      .expect('Content-Type', /json/)
    expect(result.body).to.be.a('array')
    expect(result.statusCode).to.equal(200)
  })

  it('Should login successfully by using user email and password', async () => {
    const userInfo = {
      email: 'test@testtwo.com',
      password: '1234'
    }
    const result = await request(app).post('/api/login')
      .send(userInfo)
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('object')
    expect(result.statusCode).to.equal(200)
  })

  it('Should find a user info by using his/her id', async () => {
    const result = await request(app).get('/api/users/1')
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('object')
    expect(result.statusCode).to.equal(200)
    expect(result.body.id).to.equal(1)
  })

  it('Should edit a user info by using his/her id', async () => {
    const userData = {
      orgName: 'CYF',
      password: '1234',
      fullname: 'Khaled',
      email: 'test@testtwo.com'
    }
    const result = await request(app).put('/api/users/1')
      .send(userData)
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('object')
    expect(result.statusCode).to.equal(200)
  })

  it('Should edit a user role and other info by using his/her id', async () => {
    const userData = {
      id: 1,
      role: 'Admin',
      organisation: 'CYF',
      fullname: 'Khaled'
    }
    const result = await request(app).put('/api/user/role')
      .send(userData)
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('object')
    expect(result.statusCode).to.equal(200)
  })

  it.skip('should add new user with singup endpoint', async () => {
    const userData = {
      orgName: 'CYF',
      password: '1234',
      fullname: 'testThree',
      email: 'testthree@testthree.com'
    }
    const result = await request(app).post('/api/signup')
      .send(userData)
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('object')
    expect(result.statusCode).to.equal(200)
    expect(result.body.success).to.equal(true)
  })

  it('Should delete a user info by using his/her id', async () => {
    const result = await request(app).delete('/api/users/1')
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('object')
    expect(result.body.success).to.equal(true)
    expect(result.body.response).to.equal(1)
  })

  it.skip('Should return empty string for user his/her id 1', async () => {
    const result = await request(app).get('/api/users/1')
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('string')
    expect(result.body.length).to.equal(0)
  })

})
