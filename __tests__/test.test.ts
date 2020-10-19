import app from './../src/app'
const request = require('supertest')

describe('Test Routes', () => {
  it('should test sucess result', async () => {
    const result = await request(app).get('/test/1')

    expect(result.status).toBe(200)
  })

  // it('should test failure result', async () => {
  //   const result = await request(app).get('/test/name')

  //   expect(result.status).toBe(400)
  // })
})
