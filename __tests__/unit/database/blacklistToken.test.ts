import { blackListTokenRepository } from './../../../src/repositories'
import createToken from './../../../src/utils/createToken'

describe('Database', () => {
  describe('backlistToken Repository', () => {
    let token: string

    function createValidToken() {
      const pseudoUserID = 'mdaidadoiai'
      token = createToken(pseudoUserID)
    }

    beforeAll(() => {
      return createValidToken()
    })

    test('add token to blacklist to invalid token list and return "1" if sucessful insertion', async () => {
      const blackListToken = new blackListTokenRepository()

      const addTokenToBlacklistRequest = await blackListToken.create(token)

      expect(addTokenToBlacklistRequest).toBe(1)
    })

    test('verify if token exists in blacklist and return token', async () => {
      const blackListToken = new blackListTokenRepository()

      const getTokenRequest = await blackListToken.get(token)

      expect(getTokenRequest?.token).toBe(token)
    })
  })
})
