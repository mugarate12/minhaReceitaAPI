import request from 'supertest'
import bcrypt from 'bcryptjs'

import app from './../../../src/app'
import { UserRepository } from './../../../src/repositories'

describe('API Requests', () => {
  describe('Session Routes', () => {
    const user = {
      email: 'sessionRoutesTestes@gmail.com',
      name: 'MateusC',
      password: 'minhasenha'
    }

    async function registerNewUser() {
      const users = new UserRepository()
      const salt = await bcrypt.genSalt()
      const hashPassword = await bcrypt.hash(user.password, salt)
      
      await users.create(user.email, user.name, hashPassword)
    }

    beforeAll(async () => {
      await registerNewUser()
      return
    })

    test('request a new token with user email and password and return status 201 and token in body', async () => {
      const createTokenRequest = await request(app)
        .post('/session')
        .send({
          email: user.email,
          password: user.password
        })

      expect(createTokenRequest.status).toBe(201)
      expect(createTokenRequest.body.token).toBeDefined()
    })

    test('failure to request new token by invalid user email and return status 400', async () => {
      const createTokenRequest = await request(app)
        .post('/session')
        .send({
          email: 'user.email',
          password: user.password
        })

      expect(createTokenRequest.status).toBe(400)
    })

    test('failure to request new token by invalid password and return status 406', async () => {
      const createTokenRequest = await request(app)
        .post('/session')
        .send({
          email: user.email,
          password: 'pseudoPassword'
        })

      expect(createTokenRequest.status).toBe(406)
    })

    test('request a new password to user and send this to email and return status 200', async () => {
      const createANewPasswordToUserRequest = await request(app)
        .put('/session')
        .send({
          email: user.email
        })

      expect(createANewPasswordToUserRequest.status).toBe(200)
    })

    test('failure to request new password by invalid user email and return status 400', async () => {
      const invalidEmail = 'myInvalidEmail'
      
      const createANewPasswordToUserRequest = await request(app)
        .put('/session')
        .send({
          email: invalidEmail
        })

      expect(createANewPasswordToUserRequest.status).toBe(400)
    })
  })
})
