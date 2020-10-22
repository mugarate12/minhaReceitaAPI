import request from 'supertest'
import bcrypt from 'bcryptjs'

import app from './../src/app'
import database from './../src/database/connection'

describe('Session Cases', () => {
  describe('Session create cases', () => {
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
})