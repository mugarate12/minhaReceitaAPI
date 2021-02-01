import { 
  UserRepository,
  RecipeRepository 
} from './../../../src/repositories'

describe('Database', () => {
  describe('Recipe Repository', () => {
    const user = {
      email: 'databaseTestRecipeRepository@mail.com',
      name: 'DatabaseTest',
      password: 'mytest123',
      username: 'recipeDatabaseTestUsername'
    }
    const recipeInformationForUpdatesRequest = {
      title: 'bolo de cenoura',
      time: '30:00',
      number_of_portions: 8,
      preparation_mode: 'modo de preparação',
      observations: 'essa é a nova observação'
    }
    let userID: string
    let recipeID: string

    async function createUser() {
      const users = new UserRepository()

      const createdUserRequest = await users.create(user.email, user.name, user.password, user.username)
      return createdUserRequest
    }

    async function getUserID() {
      const users = new UserRepository()
      
      const getUserRequest = await users.get({ email: user.email }, ['id'])
      userID = getUserRequest.id
      return
    }

    beforeAll(async () => {
      await createUser()
      return await getUserID()
    })

    test('create recipe with title, time, number of portions, preparation mode, observations, userID and return "1" if sucessful create', async () => {
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
      recipeID = createRecipeRequest
    })

    test('failure to create recipe by userID is invalid and return App Error', async () => {
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
        expect(error.httpCode).toBeDefined()
        expect(error.isOperational).toBeDefined()
      }
    })

    test('get recipe by recipe ID an return recipe information', async () => {
      const recipes = new RecipeRepository()

      const getRecipeRequest = await recipes.get(recipeID)

      expect(getRecipeRequest?.id).toBeDefined()
      expect(getRecipeRequest?.title).toBeDefined()
      expect(getRecipeRequest?.time).toBeDefined()
      expect(getRecipeRequest?.number_of_portions).toBeDefined()
      expect(getRecipeRequest?.preparation_mode).toBeDefined()
      expect(getRecipeRequest?.observations).toBeDefined()
      expect(getRecipeRequest?.userIDFK).toBeDefined()
    })

    test('get all recipes by userID, offset and limit and return recipes if sucessful', async () => {
      const recipes = new RecipeRepository()

      const getAllRecipesRequest = await recipes.index(userID, 0, 100)

      expect(getAllRecipesRequest).toBeDefined()
      // garantindo que pra cada receita ela tenha as devidas informações
      getAllRecipesRequest?.map((recipe) => {
        expect(recipe?.id).toBeDefined()
        expect(recipe?.title).toBeDefined()
        expect(recipe?.time).toBeDefined()
        expect(recipe?.number_of_portions).toBeDefined()
      })
    })

    test('update recipe title with recipeID and new title and return "1" if sucessful update', async () => {
      const recipes = new RecipeRepository()

      const updateRecipeTitleRequest = await recipes.update(recipeID, {
        title: recipeInformationForUpdatesRequest.title
      })

      expect(updateRecipeTitleRequest).toBe(1)
    })

    test('update recipe time with recipeID and new time and return "1" if sucessful update ', async () => {
      const recipes = new RecipeRepository()

      const updateRecipeTimeRequest = await recipes.update(recipeID, {
        time: recipeInformationForUpdatesRequest.time
      })

      expect(updateRecipeTimeRequest).toBe(1)
    })

    test('update recipe number of portions with recipeID and new number of portions and return "1" if sucessful update', async () => {
      const recipes = new RecipeRepository()

      const updateRecipeNumberOfPortions = await recipes.update(recipeID, {
        number_of_portions: recipeInformationForUpdatesRequest.number_of_portions
      })

      expect(updateRecipeNumberOfPortions).toBe(1)
    })

    test('update recipe preparation mode with recipeID and new preparation mode and return "1" if sucessful update', async () => {
      const recipes = new RecipeRepository()

      const updateRecipePreparationMode = await recipes.update(recipeID, {
        preparation_mode: recipeInformationForUpdatesRequest.preparation_mode
      })

      expect(updateRecipePreparationMode).toBe(1)
    })

    test('update recipe observation with recipeID and new observation and return "1" if sucessful update', async () => {
      const recipes = new RecipeRepository()

      const updateRecipeObservation = await recipes.update(recipeID, {
        observations: recipeInformationForUpdatesRequest.observations
      })

      expect(updateRecipeObservation).toBe(1)
    })

    test('failure to update recipe by invalid recipeID and return App Error', async () => {
      const recipes = new RecipeRepository()
      let falseID = 'i am false id'
      let updateRecipeRequest

      try {
        updateRecipeRequest = await recipes.update(falseID, {
          title: 'example'
        })
      } catch (error) {
        expect(error.name).toBeDefined()
        expect(error.httpCode).toBeDefined()
        expect(error.isOperational).toBeDefined()
      }
    })

    test('delete recipe with recipeID and return "1" if sucessful delete', async () => {
      const recipes = new RecipeRepository()

      const deleteRecipeRequest = await recipes.delete(recipeID)

      expect(deleteRecipeRequest).toBe(1)
    })

    test('failure delete recipe by invalid recipeID and return App Error', async () => {
      const recipes = new RecipeRepository()
      let deleteRecipeRequest

      try {
        deleteRecipeRequest = await recipes.delete(recipeID)
      } catch (error) {
        expect(error.name).toBeDefined()
        expect(error.httpCode).toBeDefined()
        expect(error.isOperational).toBeDefined()
      }
    })
  })
})