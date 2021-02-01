import { UserRepository } from './../../../src/repositories'

describe('Database', () => {
  describe('user Repository', () => {
    const user = {
      email: 'databaseTestUserRepository@mail.com',
      name: 'DatabaseTest',
      password: 'mytest123',
      username: 'databaseTestUsername'
    }
    
    test('create user in database with userRepository and return "0" if sucessful insertion', async () => {
      const users = new UserRepository()

      const createdUserRequest = await users.create(user.email, user.name, user.password, user.username)
      
      expect(createdUserRequest).toBe(0)
    })

    test('failure to create user in database by invalid field and get App Error', async () => {
      const users = new UserRepository()
      let createdUserRequest

      try{
        createdUserRequest = await users.create(user.email, user.name, user.password, user.username)
      } catch (error) {
        expect(error.name).toBeDefined()
        expect(error.httpCode).toBeDefined()
        expect(error.isOperational).toBeDefined()
      }
    })

    test('sucessful to get user information in database with username and return user id and name', async () => {
      const users = new UserRepository()
      
      const getUserRequest = await users.get({
        email: user.email
      }, ['id', 'name'])

      expect(getUserRequest.id).toBeDefined()
      expect(getUserRequest.name).toBe(user.name)
    })

    test('failure to get user information and return error by invalid user email', async () => {
      const users = new UserRepository()
      const fakeUserEmail = 'useremailvalid@mail.com'
      let getUserRequest

      try {
        getUserRequest = await users.get({
          email: fakeUserEmail
        }, ['id', 'name'])
      } catch (error) {
        expect(error.name).toBeDefined()
        expect(error.httpCode).toBeDefined()
        expect(error.isOperational).toBeDefined()
      }
    })

    test('update name of user by user.id and return "1" if sucessful update', async () => {
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

    test('update user password by user.id and return "1" if sucessful update', async () => {
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

    test('update username by user.id and return "1" if sucessful update', async () => {
      const users = new UserRepository()
      const getUserRequest = await users.get({
        email: user.email
      }, ['id'])
      const newUsername = 'databaseTestNewUsername'

      const updateUsernameRequest = await users.update(getUserRequest.id, {
        username: newUsername
      })

      expect(updateUsernameRequest).toBe(1)

    })

    test('failure update user by invalid user.id and return App Error', async () => {
      const users = new UserRepository()
      const invalidId = '1111111111'
      let updateWithInvalidIdRequest

      try {
        updateWithInvalidIdRequest = await users.update(invalidId, { name: 'dada' })
      } catch (error) {
        expect(error.name).toBeDefined()
        expect(error.httpCode).toBeDefined()
        expect(error.isOperational).toBeDefined()
      }
    })

    test('delete user with email and return "1" if sucessful delete', async () => {
      const users = new UserRepository()

      const deleteUserRequest = await users.delete({
        email: user.email
      })

      expect(deleteUserRequest).toBe(1)
    })
  })
})
