import {
  UserRepository,
  blackListTokenRepository,
  RecipeRepository
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

  describe('delete user', () => {
    it('sucess to delete user', async () => {
      const users = new UserRepository()

      const deleteUserRequest = await users.delete({
        email: user.email
      })

      expect(deleteUserRequest).toBe(1)
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

  describe('Recipe cases', () => {
    const user = {
      email: 'databaseUser@mail.com',
      name: 'DatabaseTest',
      password: 'mytest123'
    }
    let userID: string
    let recipeID: number

    async function createUser() {
      const users = new UserRepository()

      const createdUserRequest = await users.create(user.email, user.name, user.password)
      return createdUserRequest
    }

    async function getUserID() {
      const users = new UserRepository()
      
      const getUserRequest = await users.get({ email: user.email }, ['id'])
      userID = getUserRequest.id
      return
    }

    async function createRecipe() {
      const recipes = new RecipeRepository()
      const recipe = {
        title: 'bolo de banana',
        time: '40:00',
        number_of_portions: 10,
        preparation_mode: 'parapraroparpoirpoa',
        observations: 'essa é uma observação'
      }

      const createRecipeRequest = await recipes.create(
        recipe.title,
        recipe.time,
        recipe.number_of_portions,
        recipe.preparation_mode,
        recipe.observations,
        userID
      )
      
      return createRecipeRequest
    }

    async function getRecipeID(userID: string) {
      const recipes = new RecipeRepository()

      const getAllRecipesRequest = await recipes.index(userID)
      recipeID = getAllRecipesRequest[0].id

      return recipeID
    }

    beforeAll(async () => {
      await createUser()
      return await getUserID()
    })

    describe('create recipe', () => {
      it('sucess to create recipe', async () => {
        const recipes = new RecipeRepository()
        const recipe = {
          title: 'bolo de banana',
          time: '40:00',
          number_of_portions: 10,
          preparation_mode: 'parapraroparpoirpoa',
          observations: 'essa é uma observação'
        }

        const createRecipeRequest = await recipes.create(
          recipe.title,
          recipe.time,
          recipe.number_of_portions,
          recipe.preparation_mode,
          recipe.observations,
          userID
        )

        expect(createRecipeRequest).toBeDefined()
      })

      it('falure to create recipe', async () => {
        const recipes = new RecipeRepository()
        const recipe = {
          title: 'bolo de banana',
          time: '40:00',
          number_of_portions: 10,
          preparation_mode: 'parapraroparpoirpoa',
          observations: 'essa é uma observação'
        }
        let createRecipeRequest

        try {
          createRecipeRequest = await recipes.create(
            recipe.title,
            recipe.time,
            recipe.number_of_portions,
            recipe.preparation_mode,
            recipe.observations,
            'sou um falso id de user'
          )
        } catch (error) {
          expect(error.name).toBeDefined()
          expect(error.message).toBeDefined()
        }
      })
    })

    describe('get a recipe', () => {
      it('sucess to get a recipe with id', async () => {
        const recipes = new RecipeRepository()
        const recipeID = await createRecipe()

        const getRecipeRequest = await recipes.get(recipeID)

        expect(getRecipeRequest?.id).toBeDefined()
        expect(getRecipeRequest?.title).toBeDefined()
        expect(getRecipeRequest?.time).toBeDefined()
        expect(getRecipeRequest?.number_of_portions).toBeDefined()
        expect(getRecipeRequest?.preparation_mode).toBeDefined()
        expect(getRecipeRequest?.observations).toBeDefined()
        expect(getRecipeRequest?.userIDFK).toBeDefined()
      })

      it('get all recipes from user', async () => {
        const recipes = new RecipeRepository()

        const getAllRecipesRequest = await recipes.index(userID)

        expect(getAllRecipesRequest).toBeDefined()
        // garantindo que pra cada receita ela tenha as devidas informações
        getAllRecipesRequest?.map((recipe) => {
          expect(recipe?.id).toBeDefined()
          expect(recipe?.title).toBeDefined()
          expect(recipe?.time).toBeDefined()
          expect(recipe?.number_of_portions).toBeDefined()
          expect(recipe?.preparation_mode).toBeDefined()
          expect(recipe?.observations).toBeDefined()
          expect(recipe?.userIDFK).toBeDefined()
        })
      })
    })

    describe('update a recipe', () => {
      const recipeNewInformation = {
        title: 'bolo de cenoura',
        time: '30:00',
        number_of_portions: 8,
        preparation_mode: 'modo de preparação',
        observations: 'essa é a nova observação'
      }

      beforeAll(async () => {
        await getUserID()
        return await getRecipeID(userID)
      })

      it('update recipe title', async () => {
        const recipes = new RecipeRepository()

        const updateRecipeTitleRequest = await recipes.update(recipeID, {
          title: recipeNewInformation.title
        })

        expect(updateRecipeTitleRequest).toBe(recipeID)
      })

      it('update recipe time', async () => {
        const recipes = new RecipeRepository()

        const updateRecipeTimeRequest = await recipes.update(recipeID, {
          time: recipeNewInformation.time
        })

        expect(updateRecipeTimeRequest).toBe(recipeID)
      })

      it('update recipe number of portions', async () => {
        const recipes = new RecipeRepository()

        const updateRecipeNumberOfPortions = await recipes.update(recipeID, {
          number_of_portions: recipeNewInformation.number_of_portions
        })

        expect(updateRecipeNumberOfPortions).toBe(recipeID)
      })

      it('update recipe preparation mode', async () => {
        const recipes = new RecipeRepository()

        const updateRecipePreparationMode = await recipes.update(recipeID, {
          preparation_mode: recipeNewInformation.preparation_mode
        })

        expect(updateRecipePreparationMode).toBe(recipeID)
      })

      it('update recipe observation', async () => {
        const recipes = new RecipeRepository()

        const updateRecipeObservation = await recipes.update(recipeID, {
          observations: recipeNewInformation.observations
        })

        expect(updateRecipeObservation).toBe(recipeID)
      })

      it('failure to update recipe', async () => {
        const recipes = new RecipeRepository()
        let falseID = 0
        let updateRecipeRequest

        try {
          updateRecipeRequest = await recipes.update(falseID, {
            title: 'example'
          })
        } catch (error) {
          console.log(error)
          expect(error.name).toBeDefined()
          expect(error.message).toBeDefined()
        }
      })
    })

    describe('delete recipe', () => {
      beforeAll(async () => {
        await getUserID()
        return await getRecipeID(userID)
      })

      it('sucessful delete recipe', async () => {
        const recipes = new RecipeRepository()

        const deleteRecipeRequest = await recipes.delete(recipeID)

        expect(deleteRecipeRequest).toBe(recipeID)
      })

      it('failure delete recipe', async () => {
        const recipes = new RecipeRepository()
        let deleteRecipeRequest

        try {
          deleteRecipeRequest = await recipes.delete(recipeID)
        } catch (error) {
          expect(error.name).toBeDefined()
          expect(error.message).toBeDefined()
        }
      });
    })
  })
})