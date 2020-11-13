import {
  UserRepository,
  blackListTokenRepository
} from './../src/repositories'
import createToken from './../src/utils/createToken'

describe('Database Cases', () => {
  const user = {
    email: 'databaseUser@mail.com',
    name: 'DatabaseTest',
    password: 'mytest123'
  }

  describe('create user', () => {
    it('sucess insert user on users Table', async () => {
      const users = new UserRepository()

      const createdUserRequest = await users.create(user.email, user.name, user.password)

      expect(createdUserRequest).toBe(0)
    })

    it('error to have user with this email on database', async () => {
      const users = new UserRepository()
      let createdUserRequest

      try{
        createdUserRequest = await users.create(user.email, user.name, user.password)
      } catch (err) {
        expect(err.message).toBeDefined()
        expect(err.name).toBeDefined()
      }
    })
  })

  describe('get user', () => {
    it('sucess to get user with email', async () => {
      const users = new UserRepository()
      
      const getUserRequest = await users.get({
        email: user.email
      }, ['id', 'name'])

      expect(getUserRequest.id).toBeDefined()
      expect(getUserRequest.name).toBe(user.name)
    })

    it('failure to get user with email not valid', async () => {
      const users = new UserRepository()
      const fakeUserEmail = 'useremailvalid@mail.com'
      let getUserRequest

      try {
        getUserRequest = await users.get({
          email: fakeUserEmail
        }, ['id', 'name'])
      } catch (err) {
        expect(err.message).toBeDefined()
        expect(err.name).toBeDefined()
      }
    })
  })

  describe('update user', () => {
    it('sucess to update user password or name', async () => {
      const users = new UserRepository()
      const getUserRequest = await users.get({
        email: user.email
      }, ['id'])
      const newName = 'MyNewName'

      const updateUserNameRequest = await users.update(getUserRequest.id, {
        name: newName
      })

      expect(updateUserNameRequest).toBe(1)
    })

    it('sucess to update user password', async () => {
      const users = new UserRepository()
      const getUserRequest = await users.get({
        email: user.email
      }, ['id'])
      const newPassword = 'myNewPassword'

      const updateUserPasswordRequest = await users.update(getUserRequest.id, {
        password: newPassword
      })

      expect(updateUserPasswordRequest).toBe(1)
    })

    it('failure to update with id invalid', async () => {
      const users = new UserRepository()
      const invalidId = '1111111111'
      let updateWithInvalidIdRequest

      try {
        updateWithInvalidIdRequest = await users.update(invalidId, { name: 'dada' })
      } catch (err) {
        expect(err.name).toBeDefined()
        expect(err.message).toBeDefined()
      }
    })
  })
  
  describe('blackListToken cases', () => {
    let token: string

    function createValidToken() {
      const pseudoUserID = 'mdaidadoiai'
      token = createToken(pseudoUserID)
    }

    beforeAll(() => {
      return createValidToken()
    })
    
    it('insert a token to blackListToken table', async () => {
      const blackListToken = new blackListTokenRepository()

      const addTokenToBlacklistRequest = await blackListToken.create(token)

      expect(addTokenToBlacklistRequest).toBeDefined()
    })

    it('verify if token exists in blackListToken table', async () => {
      const blackListToken = new blackListTokenRepository()

      const getTokenRequest = await blackListToken.get(token)

      expect(getTokenRequest?.token).toBeDefined()
    })
  })
})