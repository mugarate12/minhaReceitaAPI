import request from 'supertest'
import bcrypt from 'bcryptjs'

import app from './../src/app'
import database from './../src/database/connection'

describe('Session Cases', () => {
  const user = {
    email: 'meuusuario@gmail.com',
    name: 'MateusC',
    password: 'minhasenha'
  }

  async function registerNewUser() {
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(user.password, salt)
    
    await database('users')
      .insert({
        id: 'dadadoiada',
        email: user.email,
        name: user.name,
        password: hashPassword
      })
  }

  async function deleteNewUser() {
    await database('users')
      .where({
        email: user.email
      })
      .delete()
  }

  describe('Session create cases', () => {
    beforeAll(async () => {
      await registerNewUser()
    })

    afterAll(async () => {
      await deleteNewUser()
    })

    it('Sucessful request and return token', async () => {
      const createTokenRequest = await request(app)
        .post('/session')
        .send({
          email: user.email,
          password: user.password
        })

      expect(createTokenRequest.status).toBe(201)
      expect(createTokenRequest.body.token).toBeDefined()
    })

    it('celebrate error', async () => {
      const createTokenRequest = await request(app)
        .post('/session')
        .send({
          email: 'user.email',
          password: user.password
        })

      expect(createTokenRequest.status).toBe(400)
    })

    it('invalid password error', async () => {
      const createTokenRequest = await request(app)
        .post('/session')
        .send({
          email: user.email,
          password: 'pseudoPassword'
        })

      expect(createTokenRequest.status).toBe(406)
    })
  })

  describe('Session send new password a user', () => {
    beforeAll(async () => {
      await registerNewUser()
    })

    afterAll(async () => {
      await deleteNewUser()
    })

    it('Request for a new password for user and send to email', async () => {
      const createANewPasswordToUserRequest = await request(app)
        .put('/session')
        .send({
          email: user.email
        })

      expect(createANewPasswordToUserRequest.status).toBe(200)
    })

    it('celebrate error', async () => {
      const invalidEmail = 'myInvalidEmail'
      
      const createANewPasswordToUserRequest = await request(app)
        .put('/session')
        .send({
          email: invalidEmail
        })

      expect(createANewPasswordToUserRequest.status).toBe(400)
    })

    it('invalid user email error', async () => {
      const userWithEmailNotExistsInDatabase = 'robinho@mail.com'

      const createANewPasswordToUserRequest = await request(app)
        .put('/session')
        .send({
          email: userWithEmailNotExistsInDatabase
        })

      expect(createANewPasswordToUserRequest.status).toBe(406)
    })
  })
})