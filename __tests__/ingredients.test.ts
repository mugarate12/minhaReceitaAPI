import request from 'supertest'

import app from './../src/app'

describe('Ingredients Cases', () => {
  const user = {
    email: 'meuusuarioReceitaRecipeCases@gmail.com',
    name: 'MateusReceita',
    password: 'minhasenha123'
  }
  let token: string
  let recipeID: number

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
        // console.log('token:', token.body.token)
        token = requestToken.body.token
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
    return getRecipeID()
  })

  describe('create ingredients cases', () => {
    test('create ingredients', async () => {
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

    test('failure to create ingredients to token invalid', async () => {
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

    test('failure to create ingredients to celebrate error', async () => {
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

    test('failure to create ingredients to invalid recipeID', async () => {
      const ingredients = [{
        name: 'Frango',
        measure: '1 kg',
        recipeIDFK: 200000
      }]

      const createIngredientsOfRecipe = await request(app)
        .post('/ingredients')
        .send({
          ingredients: ingredients
        })
        .set('Authorization', `Bearer ${token}`)

      expect(createIngredientsOfRecipe.status).toBe(406)
    })
  })

  describe('get ingredients cases', () => {
    test('get ingredients by recipeID', async () => {
      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${token}`)

      expect(getIngredientsRequest.status).toBe(200)
      getIngredientsRequest.body.ingredients.map((ingredient: { name: string, measure: string }) => {
        expect(ingredient?.name).toBeDefined()
        expect(ingredient?.measure).toBeDefined()
      })

    })

    test('failure to get ingredients for invalid Token', async () => {
      const invalidToken = 'sou um token invalido'

      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(getIngredientsRequest.status).toBe(401)
    })

    test('failure to get ingredients for not provided recipeID number with celebrate error', async () => {
      const getIngredientsRequest = await request(app)
        .get(`/recipes/recipeID/ingredients`)
        .set('Authorization', `Bearer ${token}`)

      expect(getIngredientsRequest.status).toBe(400)
    })
  })

  describe('update ingredients cases', () => {
    let ingredientID: number

    async function getIngredientID() {
      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${token}`)

      return getIngredientsRequest.body.ingredients[0].id
    }

    beforeAll(async () => {
      ingredientID = await getIngredientID()
      return
    })

    test('sucessful update ingredient', async () => {
      const ingredientNewMeasure = '22kg'

      const updateIngredientRequest = await request(app)
        .put(`/recipes/${recipeID}/ingredients/${ingredientID}`)
        .send({
          measure: ingredientNewMeasure
        })
        .set('Authorization', `Bearer ${token}`)

      expect(updateIngredientRequest.status).toBe(200)
      expect(updateIngredientRequest.body.sucess).toBe('ingrediente alterado com sucesso')
    })

    test('failure update ingredient by invalid token', async () => {
      const ingredientNewMeasure = '22kg'
      const invalidToken = 'token invalido'

      const updateIngredientRequest = await request(app)
        .put(`/recipes/${recipeID}/ingredients/${ingredientID}`)
        .send({
          measure: ingredientNewMeasure
        })
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(updateIngredientRequest.status).toBe(401)
    })

    test('failure update ingredient by celebrate error for id params', async () => {
      const ingredientNewMeasure = '22kg'
      const invalidRecipeID = 'id'
      const invalidIngredientID = 'id'

      const updateIngredientRequest = await request(app)
        .put(`/recipes/${invalidRecipeID}/ingredients/${invalidIngredientID}`)
        .send({
          measure: ingredientNewMeasure
        })
        .set('Authorization', `Bearer ${token}`)

      expect(updateIngredientRequest.status).toBe(400)
    })
  })

  describe('delete ingredient cases', () => {
    let ingredientID: number

    async function getIngredientID() {
      const getIngredientsRequest = await request(app)
        .get(`/recipes/${recipeID}/ingredients`)
        .set('Authorization', `Bearer ${token}`)

      return getIngredientsRequest.body.ingredients[0].id
    }

    beforeAll(async () => {
      ingredientID = await getIngredientID()
      return
    })

    test('sucessful delete ingredient ', async () => {
      const deleteIngredientRequest = await request(app)
        .delete(`/ingredients/${ingredientID}`)
        .set('Authorization', `Bearer ${token}`)

      expect(deleteIngredientRequest.status).toBe(200)
    })

    test('failure delete ingredient by invalid token', async () => {
      const invalidToken = 'token invalido'

      const deleteIngredientRequest = await request(app)
        .delete(`/ingredients/${ingredientID}`)
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(deleteIngredientRequest.status).toBe(401)
    })
  })
})