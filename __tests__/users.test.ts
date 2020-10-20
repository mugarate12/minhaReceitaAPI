import app from './../src/app'
import request from 'supertest'

describe('Users tests', () => {
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
})