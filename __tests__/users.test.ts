import app from './../src/app'
import request, { Response } from 'supertest'
import bcrypt from 'bcryptjs'

import database from './../src/database/connection';
import { TABLE_USERS_NAME } from './../src/database/types';
import { UsersInterface } from './../src/database/interfaces';

describe('Users tests', () => {
  const testUser = {
    id: 'dadada',
    name: 'João',
    email: 'joaomail@mail.com',
    password: 'minhasenha'
  }
  
  async function createUser() {
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(testUser.password, salt)

    return await database<UsersInterface>(TABLE_USERS_NAME)
      .insert({ ...testUser, password: hashPassword })
  }

  async function deleteUser() {
    return await database<UsersInterface>(TABLE_USERS_NAME)
      .where({
        id: testUser.id
      })
      .delete()
  }

  describe('Create new user cases', () => {
    it('create user sucess', async () => {
      const user = {
        name: 'Mateus',
        email: 'serjumano17@gmail.com',
        password: 'majuge123'
      }
      
      const createUserRequest = await request(app)
        .post('/users')
        .send(user)
  
      expect(createUserRequest.status).toBe(201)
      expect(createUserRequest.body.sucess).toBe('Usuário criado com sucesso!')
    })

    it('celebrate validate error', async () => {
      const user = {
        name: 'Mateus',
        email: 'serjumano17',
        password: 'majuge123'
      }

      const createUserRequest = await request(app)
        .post('/users')
        .send(user)

      expect(createUserRequest.status).toBe(400)
    })

    it('Database error as invalid input or not a valid user ', async () => {
      const user = {
        name: 'Mateus',
        email: 'serjumano17@gmail.com',
        password: 'majuge123'
      }

      const createUserRequest = await request(app)
        .post('/users')
        .send(user)

      expect(createUserRequest.status).toBe(406)
    })
  })

  describe('Get User cases', () => {
    let token: string
    
    beforeAll(async () => {
      await createUser()

      return await request(app)
        .post('/session')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .then((response) => {
          token = response.body.token
        })
    })

    afterAll(async () => {
      return await deleteUser()
    })

    it('get a user information by resquest with token', async () => {
      const userInformationRequest = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)

      expect(userInformationRequest.status).toBe(200)
    })

    it('Invalid token request', async () => {
      const userInformationRequest = await request(app)
        .get('/users')
        .set('Authorization', `Bearer dadaidjaidaodnoaidnoaidaudoisadinsa`)

      expect(userInformationRequest.status).toBe(401)
    })
  })
})