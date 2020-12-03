import app from './../src/app'
import request from 'supertest'
import bcrypt from 'bcryptjs'

import {
  UserRepository
} from './../src/repositories'

describe('Users tests', () => {
  let testUser = {
    id: 'dadada',
    name: 'João',
    email: 'joaomail@mail.com',
    password: 'minhasenha123'
  }
  
  async function createUser() {
    const users = new UserRepository()
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(testUser.password, salt)

    await users.create(testUser.email, testUser.name, hashPassword)
  }

  async function deleteUser() {
    const users = new UserRepository()

    return await users.delete({
      email: testUser.email
    })
  }

  describe('Create new user cases', () => {
    test('create user sucess', async () => {
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

    test('celebrate validate error', async () => {
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

    test('Database error as invalid input or not a valid user ', async () => {
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

    test('get a user information by resquest with token', async () => {
      const userInformationRequest = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)

      expect(userInformationRequest.status).toBe(200)
    })

    test('Invalid token request', async () => {
      const userInformationRequest = await request(app)
        .get('/users')
        .set('Authorization', `Bearer dadaidjaidaodnoaidnoaidaudoisadinsa`)

      expect(userInformationRequest.status).toBe(401)
    })
  })

  describe('Update user Cases', () => {
    let token: string

    async function updateToken(newPassword: string) {
      return await request(app)
        .post('/session')
        .send({
          email: testUser.email,
          password: newPassword
        })
        .then((response) => {
          token = response.body.token
          return response.body.token
        })
    }

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

    test('update user password', async () => {
      const newPassword = 'newPassword123'

      const updateUserPasswordRequest = await request(app)
        .put(`/users?type=password`)
        .send({
          password: newPassword
        })
        .set('Authorization', `Bearer ${token}`)

      const newToken = await updateToken(newPassword)

      expect(updateUserPasswordRequest.status).toBe(200)
      expect(updateUserPasswordRequest.body.sucess).toBeDefined()
    })

    test('update name of user', async () => {
      const newName = 'João Pedro'

      const updateUserNameRequest = await request(app)
        .put(`/users?type=name`)
        .send({
          name: newName
        })
        .set('Authorization', `Bearer ${token}`)

      expect(updateUserNameRequest.status).toBe(200)
      expect(updateUserNameRequest.body.sucess).toBeDefined()
    })

    test('update user email', async () => {
      const newEmail = 'joaopedromail@mail.com'

      const updateUserEmailRequest = await request(app)
        .put(`/users?type=email`)
        .send({
          email: newEmail
        })
        .set('Authorization', `Bearer ${token}`)

      expect(updateUserEmailRequest.status).toBe(200)
      expect(updateUserEmailRequest.body.sucess).toBeDefined()

      testUser.email = newEmail
    })

    test('celebrate error', async () => {
      const validEmail = 'mail@mail.com'
      const invalidEmail = 'mail.com'

      const queryParamsErrorRequest = await request(app)
        .put(`/users`)
        .send({
          email: validEmail
        })
        .set('Authorization', `Bearer ${token}`)
      
      const emailErrorRequest = await request(app)
        .put(`/users?type=email`)
        .send({
          email: invalidEmail
        })
        .set('Authorization', `Bearer ${token}`)

      expect(queryParamsErrorRequest.status).toBe(400)
      expect(emailErrorRequest.status).toBe(400)
    })
  })
})