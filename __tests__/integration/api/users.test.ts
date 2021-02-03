import request from 'supertest'
import bcrypt from 'bcryptjs'

import app from './../../../src/app'
import { UserRepository } from './../../../src/repositories'

describe('API Requests', () => {
  describe('User routes', () => {
    let testUser: {
      name: string;
      email: string;
      password: string;
      username: string;
    }
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

    test('create a new user with name, email and password and return status 201 and a sucess message on body', async () => {
      const user = {
        name: 'Mateus',
        email: 'serjumano17@gmail.com',
        password: 'majuge123',
        username: 'APITestUsername'
      }
      // setando o usuario de teste com as informações do usuario criado no teste
      testUser = user
      
      const createUserRequest = await request(app)
        .post('/users')
        .send(user)
  
      expect(createUserRequest.status).toBe(201)
      expect(createUserRequest.body.sucess).toBe('Usuário criado com sucesso!')
    })

    test('failure to create user by invalid email and return status 400', async () => {
      const user = {
        name: 'Mateus',
        email: 'serjumano17',
        password: 'majuge123',
        username: 'APITestUsername'
      }

      const createUserRequest = await request(app)
        .post('/users')
        .send(user)

      expect(createUserRequest.status).toBe(400)
    })

    test('failure to create user by invalid input or invalid user and return status 406', async () => {
      const user = {
        name: 'Mateus',
        email: 'serjumano17@gmail.com',
        password: 'majuge123',
        username: 'APITestUsername'
      }

      const createUserRequest = await request(app)
        .post('/users')
        .send(user)

      expect(createUserRequest.status).toBe(406)
    })

    test('failure to create user by invalid password error and return status 406 and "Invalid Password" message in body.error.name field', async () => {
      const user = {
        name: 'Mateus',
        email: 'serjumano1000@gmail.com',
        password: 'majuge',
        username: 'APITestUsername'
      }
      
      const createUserRequest = await request(app)
        .post('/users')
        .send(user)

      expect(createUserRequest.status).toBe(406)
      expect(createUserRequest.body.error.name).toBe('Invalid Password')
    })

    test('get user information with user Token and return status 200', async () => {
      await request(app)
        .post('/session')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .then((response) => {
          token = response.body.token
        })
      
      const userInformationRequest = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)

      expect(userInformationRequest.status).toBe(200)
    })

    test('get user information with username and return status 200 with json content name, email and username', async () => {
      const userInformationRequest = await request(app)
        .get(`/users/${testUser.username}`)
      
      expect(userInformationRequest.status).toBe(200)
    })

    test('failure to get user information by invalid token and return status 401', async () => {
      const invalidToken = 'dadadiaodiaodia'
      
      const userInformationRequest = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(userInformationRequest.status).toBe(401)
    })

    test('update user password with user token and new password and return status 200 and sucess message on body', async () => {
      const newPassword = 'newPassword123'

      const updateUserPasswordRequest = await request(app)
        .put(`/users?type=password`)
        .send({
          password: newPassword
        })
        .set('Authorization', `Bearer ${token}`)

      await updateToken(newPassword)

      expect(updateUserPasswordRequest.status).toBe(200)
      expect(updateUserPasswordRequest.body.sucess).toBeDefined()
    })

    test('update name of user with user token and return status 200 and sucess message on body', async () => {
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

    test('update user email with user token and return status 200 and sucess message on body', async () => {
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

    test('update username with user token and return status 200 and sucess message on body', async () => {
      const newUsername = 'APITestNewUsername'

      const updateUserEmailRequest = await request(app)
        .put(`/users?type=email`)
        .send({
          username: newUsername
        })
        .set('Authorization', `Bearer ${token}`)

      expect(updateUserEmailRequest.status).toBe(200)
      expect(updateUserEmailRequest.body.sucess).toBeDefined()

      testUser.username = newUsername
    })
    
    test('failure to update user information by query param no provided and return status 400', async () => {
      const validEmail = 'mail@mail.com'

      const queryParamsErrorRequest = await request(app)
        .put(`/users`)
        .send({
          email: validEmail
        })
        .set('Authorization', `Bearer ${token}`)

      expect(queryParamsErrorRequest.status).toBe(400)
    })

    test('failure to update user information by invalid field provided and return status 400', async () => {
      const invalidEmail = 'mail.com'

      const emailErrorRequest = await request(app)
        .put(`/users?type=email`)
        .send({
          email: invalidEmail
        })
        .set('Authorization', `Bearer ${token}`)

      expect(emailErrorRequest.status).toBe(400)
    })
  })
})
