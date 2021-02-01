import {
  UserRepository,
  RecipeRepository,
  IngredientsRepository
} from './../../../src/repositories'

describe('Database', () => {
  describe('Ingredients Repository', () => {
    const user = {
      email: 'databaseTestIngredientsRepository@mail.com',
      name: 'DatabaseTest',
      password: 'mytest123',
      username: 'ingredientsDatabaseTestUsername'
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
      
      recipeID = createRecipeRequest
      return createRecipeRequest
    }

    beforeAll(async () => {
      await createUser()
      await getUserID()
      await createRecipe()
    })

    test('create ingredients of a recipe with ingredients array object with name, measure and recipeIdFK', async () => {
      const ingredients = new IngredientsRepository()
      const ingredient = {
        name: 'banana picada',
        measure: 'duas bananas',
        recipeIDFK: recipeID
      }

      const createIngredientRequest = await ingredients.create(ingredient)

      expect(createIngredientRequest).toBeDefined()
    })

    test('failure to create ingredients of a recipe by a invalid recipeIDFK and return App Error', async () => {
      const ingredients = new IngredientsRepository()
      const ingredient = {
        name: 'banana picada',
        measure: 'duas bananas',
        recipeIDFK: 'i am invalid Recipe ID'
      }
      let createIngredientRequest

      try {
        createIngredientRequest = await ingredients.create(ingredient)
      } catch (error) {
        expect(error.name).toBeDefined()
        expect(error.httpCode).toBeDefined()
        expect(error.isOperational).toBeDefined()
      }
    })

    test('get ingredients of a recipe with recipe ID and return array of ingredients with id, name, measure and recipeIDFK', async () => {
      const ingredients = new IngredientsRepository()

      const getIngredientsRequest = await ingredients.index(recipeID)

      getIngredientsRequest.map((ingredient) => {
        expect(ingredient.id).toBeDefined()
        expect(ingredient.name).toBeDefined()
        expect(ingredient.measure).toBeDefined()
        expect(ingredient.recipeIDFK).toBeDefined()
      })
    })

    test('update ingredients of recipe with recipe ID, ingredient ID and name or measure new field and return "1" if one field passed or "2" if two fields passed', async () => {
      const ingredients = new IngredientsRepository()
      const IngredientsWithThisRecipe = await ingredients.index(recipeID)
      const ingredientNewMeasure = 'X g'

      const updateIngredientsRequest = await ingredients.update(
        recipeID,
        IngredientsWithThisRecipe[0].id,
        {
          measure: ingredientNewMeasure
        })

      expect(updateIngredientsRequest).toBe(1)
    })

    test('failure update ingredient by ingredient ID invalid and return App Error', async () => {
      const ingredients = new IngredientsRepository()
      const invalidIngredientID = 2000
      let updateIngredientsRequest

      try {
        updateIngredientsRequest = await ingredients.update(
          recipeID,
          invalidIngredientID,
          {
            measure: '4 colheres'
          })
      } catch (error) {
        expect(error.name).toBeDefined()
        expect(error.httpCode).toBeDefined()
        expect(error.isOperational).toBeDefined()
      }

      expect(updateIngredientsRequest)
    })

    test('delete ingredient of recipe and return "1" if sucessful', async () => {
      const recipes = new RecipeRepository()
      const getAllRecipesRequest = await recipes.index(userID, 0, 100)
      const recipeID = getAllRecipesRequest[0]?.id
      const ingredients = new IngredientsRepository()
      const IngredientsOfRecipe = await ingredients.index(recipeID)

      const deleteIngredientRequest = await ingredients.delete(IngredientsOfRecipe[0].id)

      expect(deleteIngredientRequest).toBe(1)
    })

    test('failure to delete ingredient of recipe by invalid ingredient ID', async () => {
      const ingredients = new IngredientsRepository()
      const invalidIngredientID = 2000000
      let deleteIngredientRequest

      try {
        deleteIngredientRequest = await ingredients.delete(invalidIngredientID)
      } catch (error) {
        expect(error.name).toBeDefined()
        expect(error.httpCode).toBeDefined()
        expect(error.isOperational).toBeDefined()
      }
    })
  })
})