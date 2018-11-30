import { expect } from 'chai'
import request from 'supertest';
import app from '../src/app'
import {
  addUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUsersById,
  getUserByEmail,
  updateUserbyEmail
} from '../src/controllers/users_controller'

describe('Test users controller functions', () => {

  it('Should add new user', async () => {
    const userData = {
      email: 'test@hotmail.com',
      organisation: 'CYF',
      fullname: 'test',
      salt_password: '1234'
    }
    const result = await addUser(userData);
    expect(result).to.be.a('object')
    expect(result.email).to.equal(userData.email)
  })

  it.skip('Should get list of users and at least includes one user', async () => {
    const result = await getAllUsers();
    expect(result).to.be.a('array')
    expect(result.length).to.be.at.least(1)
  })

  it.skip('Should find a user info by using his/her id', async () => {
    const userId = 1;
    const result = await getUsersById(userId);
    expect(result).to.be.a('object')
    expect(result.id).to.equal(1)
  })

  it.skip('Should find a user info by using his/her email', async () => {
    const email = 'test@hotmail.com';
    const result = await getUserByEmail(email);
    expect(result).to.be.a('array')
    expect(result[0].email).to.equal(email)
  })

  it.skip('Should edit a user info', async () => {
    const userData = {
      email: 'test@hotmail.com',
      organisation: 'CYF',
      fullname: 'test',
      salt_password: '1234'
    }
    const userId = 1;
    const result = await updateUser(userId, userData);
    expect(result).to.be.a('number')
    expect(result).to.equal(1)
  })

  it.skip('Should delete a user info', async () => {
    const userId = 1;
    const result = await deleteUser(userId);
    expect(result).to.be.a('number')
    expect(result).to.equal(1)
  })

  it.skip('Should return empty string for user his/her id 1', async () => {
    const result = await request(app).get('/api/users/1')
      .expect('Content-Type', /json/);
    expect(result.body).to.be.a('string')
    expect(result.body.length).to.equal(0)
  })

  it('update users by email', async () => {
    const userData = {
      email: 'test@hotmail.com',
      organisation: 'CYF',
      fullname: 'test',
      salt_password: '1234'
    }
    const email = 'test@hotmail.com';
    const result = await updateUserbyEmail(email, userData);
    expect(result).to.be.a('number');
  })

})
