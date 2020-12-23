import request from 'supertest'

import app from './../../../src/app'

describe('API Requests', () => {
  describe('Ingredients Routes', () => {
    const user = {
      email: 'ingredientsRoutesTests@gmail.com',
      name: 'MateusReceita',
      password: 'minhasenha123'
    }
    let token: string
    let recipeID: string

    async function createUser() {
      return request(app)
        .post('/users')
        .send({ ...user })
    }

    async function getToken() {
      return request(app)
        .post('/session')
        .send({
          email: user.email,
          password: user.password
        })
        .then(requestToken => {
          token = requestToken.body.token
          return
        })
    }

    async function createRecipe() {
      const recipe = {
        title: 'Frango assado',
        time: '30 minutos',
        number_of_portions: 4,
        preparation_mode: `
        1 - prepare o frago com os temperos e afins
        2 - unte a frigideira com óleo
        3 - coloque pra fritar e vire a carne na metade do tempo total proposto
        `,
        observations: 'Receita apenas conceitual'
      }
  
      return await request(app)
        .post('/recipes')
        .send({ ...recipe })
        .set('Authorization', `Bearer ${token}`)
    }

    async function getRecipeID() {
      const getAllRecipesRequest = await request(app)
          .get('/recipes')
          .send({
            page: 1
          })
          .set('Authorization', `Bearer ${token}`)
        const lastRecipe = getAllRecipesRequest.body.recipes.length - 1
  
      recipeID = getAllRecipesRequest.body.recipes[lastRecipe].id
      return 
    }

    beforeAll(async () => {
      await createUser()
      await getToken()
      await createRecipe()
      await getRecipeID()
      return
    })

    test('create ingredients of a recipe with name, measure and recipeIDFK and user token and return status 200 and sucess message on body', async () => {
      const ingredients = [{
        name: 'Frango',
        measure: '1 kg',
        recipeIDFK: recipeID
      }, {
        name: 'Cebola',
        measure: 'meia cebola',
        recipeIDFK: recipeID
      }]

      const createIngredientsOfRecipe = await request(app)
        .post('/ingredients')
        .send({
          ingredients: ingredients
        })
        .set('Authorization', `Bearer ${token}`)

      expect(createIngredientsOfRecipe.status).toBe(201)
      expect(createIngredientsOfRecipe.body.sucess).toBe('ingredientes inseridos com sucesso')
    })
    
    test('failure to create ingredients by invalid token and return status 401', async () => {
      const ingredients = [{
        name: 'Frango',
        measure: '1 kg',
        recipeIDFK: recipeID
      }, {
        name: 'Cebola',
        measure: 'meia cebola',
        recipeIDFK: recipeID
      }]

      const createIngredientsOfRecipe = await request(app)
        .post('/ingredients')
        .send({
          ingredients: ingredients
        })

      expect(createIngredientsOfRecipe.status).toBe(401)
    })

    test('failure to create ingredients by invalid or not provided fields and return status 400', async () => {
      const ingredients = [{
        name: 'Frango',
        recipeIDFK: recipeID
      }, {
        name: 'Cebola',
        measure: 'meia cebola'
      }]

      const createIngredientsOfRecipe = await request(app)
        .post('/ingredients')
        .send({
          ingredients: ingredients
        })

      expect(createIngredientsOfRecipe.status).toBe(400)
    })

    test('get ingredients with recipe Id and user token and return status 200 and ingredients name and measure on request body', async () => {
      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${token}`)

      expect(getIngredientsRequest.status).toBe(200)
      getIngredientsRequest.body.ingredients.map((ingredient: { name: string, measure: string }) => {
        expect(ingredient?.name).toBeDefined()
        expect(ingredient?.measure).toBeDefined()
      })
    })

    test('failure to get ingredients by invalid token and return status 401', async () => {
      const invalidToken = 'sou um token invalido'

      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(getIngredientsRequest.status).toBe(401)
    })

    test('update one ingredient with new field, recipeID param, ingredient ID param and user token and return status 200 and sucess message on body request', async () => {
      const ingredientNewMeasure = '22kg'
      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
      const ingredientID = getIngredientsRequest.body.ingredients[0].id
      

      const updateIngredientRequest = await request(app)
        .put(`/recipes/${recipeID}/ingredients/${ingredientID}`)
        .send({
          measure: ingredientNewMeasure
        })
        .set('Authorization', `Bearer ${token}`)

      expect(updateIngredientRequest.status).toBe(200)
      expect(updateIngredientRequest.body.sucess).toBe('ingrediente alterado com sucesso')
    })

    test('failure to update ingredient by invalid token and return status 401', async () => {
      const ingredientNewMeasure = '22kg'
      const invalidToken = 'token invalido'
      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
      const ingredientID = getIngredientsRequest.body.ingredients[0].id

      const updateIngredientRequest = await request(app)
        .put(`/recipes/${recipeID}/ingredients/${ingredientID}`)
        .send({
          measure: ingredientNewMeasure
        })
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(updateIngredientRequest.status).toBe(401)
    })

    test('failure update ingredient by invalid ingredient id param and return status 400', async () => {
      const ingredientNewMeasure = '22kg'
      const invalidIngredientID = 'id'

      const updateIngredientRequest = await request(app)
        .put(`/recipes/${recipeID}/ingredients/${invalidIngredientID}`)
        .send({
          measure: ingredientNewMeasure
        })
        .set('Authorization', `Bearer ${token}`)

      expect(updateIngredientRequest.status).toBe(400)
    })

    test('delete ingredient with ingredient id param and user token and return status 200', async () => {
      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
      const ingredientID = getIngredientsRequest.body.ingredients[0].id
      
      const deleteIngredientRequest = await request(app)
        .delete(`/ingredients/${ingredientID}`)
        .set('Authorization', `Bearer ${token}`)

      expect(deleteIngredientRequest.status).toBe(200)
    })

    test('failure delete ingredient by invalid token and return status 401', async () => {
      const invalidToken = 'token invalido'
      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
      const ingredientID = getIngredientsRequest.body.ingredients[0].id

      const deleteIngredientRequest = await request(app)
        .delete(`/ingredients/${ingredientID}`)
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(deleteIngredientRequest.status).toBe(401)
    })
    
  })
})
