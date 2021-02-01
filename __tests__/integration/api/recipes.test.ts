import request from 'supertest'

import app from './../../../src/app'
import { RecipeRepository } from './../../../src/repositories'

describe('API Requests', () => {
  describe('Recipes Routes', () => {
    const user = {
      email: 'meuusuarioReceitaRecipeCases@gmail.com',
      name: 'MateusReceita',
      password: 'minhasenha123',
      username: 'RecipeAPITestUsername'
    }
    let token: string

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

    beforeAll(async () => {
      await createUser()
      await getToken()
      return
    })

    test('create recipe with title, time, number of portions, preparation mode and observations and return 201 and sucess message on body', async () => {
      const recipe = {
        title: 'Meu Frango',
        time: '30 minutos',
        number_of_portions: 10,
        preparation_mode: `
        1 - prepare a massa com arroz já cozinhado
        2 - use farinha de rosca pra empanar
        3 - faça os bolinhos com as mãos
        4 - use a airfreyer e deixe por 30 minutos
        `,
        observations: 'Receita apenas conceitual'
      }

      const createRecipeRequest = await request(app)
        .post('/recipes')
        .send({ ...recipe })
        .set('Authorization', `Bearer ${token}`)

      expect(createRecipeRequest.status).toBe(201)
      expect(createRecipeRequest.body.sucess).toBe('Receita criada com sucesso')
    })

    test('create recipe with title, time, number of portions, preparation mode, observations and ingredients and return 201 and sucess message on body ', async () => {
      const recipe = {
        title: 'Meu Frango',
        time: '30 minutos',
        number_of_portions: 10,
        preparation_mode: `
        1 - prepare a massa com arroz já cozinhado
        2 - use farinha de rosca pra empanar
        3 - faça os bolinhos com as mãos
        4 - use a airfreyer e deixe por 30 minutos
        `,
        observations: 'Receita apenas conceitual',
        ingredients: [
          {
            name: 'Açucar',
            measure: '40g'
          },
          {
            name: 'café',
            measure: '6 colheres'
          }
        ]
      }

      const createRecipeRequest = await request(app)
        .post('/recipes')
        .send({ ...recipe })
        .set('Authorization', `Bearer ${token}`)

      expect(createRecipeRequest.status).toBe(201)
      expect(createRecipeRequest.body.sucess).toBe('Receita criada com sucesso')
    })

    test('failure to create recipe by invalid or not provided field and return status 400', async () => {
      const recipe = {
        title: 'Bolinho de Chuva',
        time: '30 minutos',
        number_of_portions: 15,
        preparation_mode: `
        1 - prepare a massa com arroz já cozinhado
        2 - use farinha de rosca pra empanar
        3 - faça os bolinhos com as mãos
        4 - use a airfreyer e deixe por 30 minutos
        `
      }

      const createRecipeRequest = await request(app)
        .post('/recipes')
        .send({ ...recipe })
        .set('Authorization', `Bearer ${token}`)

      expect(createRecipeRequest.status).toBe(400)
    })

    test('failure to create recipe by invalid token and return status 401', async () => {
      const recipe = {
        title: 'Bolinho de Chuva',
        time: '30 minutos',
        number_of_portions: 10,
        preparation_mode: `
        1 - prepare a massa com arroz já cozinhado
        2 - use farinha de rosca pra empanar
        3 - faça os bolinhos com as mãos
        4 - use a airfreyer e deixe por 30 minutos
        `,
        observations: 'Receita apenas conceitual'
      }
      const invalidToken = `eu sou um token invalido`

      const createRecipeRequest = await request(app)
        .post('/recipes')
        .send({ ...recipe })
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(createRecipeRequest.status).toBe(401)
    })

    test('get all recipes of a user with user token and page number to paginate result and return status 200 and array of recipes ', async () => {
      interface RecipeInterface {
        title: string
      }
      const pageNumber = 1

      const getAllRecipesRequest = await request(app)
        .get('/recipes')
        .send({
          page: pageNumber
        })
        .set('Authorization', `Bearer ${token}`)

      expect(getAllRecipesRequest.status).toBe(200)
      expect(getAllRecipesRequest.body.recipes).toBeDefined()
      getAllRecipesRequest.body.recipes.map((recipe: RecipeInterface) => {
        expect(recipe.title).toBeDefined()
      })
    })

    test('get one recipe of a user with user token and recipe ID and return status 200 and recipe information', async () => {
      const getAllRecipesRequest = await request(app)
        .get('/recipes')
        .send({
          page: 1
        })
        .set('Authorization', `Bearer ${token}`)
      const recipeID = getAllRecipesRequest.body.recipes[0].id

      const getOneRecipeOfUser = await request(app)
        .get(`/recipes/${recipeID}`)
        .set('Authorization', `Bearer ${token}`)

      expect(getOneRecipeOfUser.status).toBe(200)
      expect(getOneRecipeOfUser.body.recipe.id).toBe(recipeID)
    })

    test('failure to get recipes by token invalid and return status 401', async () => {
      const invalidToken = 'eu sou um token invalido'
      const pageNumber = 1

      const getAllRecipesRequest = await request(app)
        .get('/recipes')
        .send({
          page: pageNumber
        })
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(getAllRecipesRequest.status).toBe(401)
    })

    test('update recipe with user token and field to update and return status 200', async () => {
      const getAllRecipesRequest = await request(app)
        .get('/recipes')
        .send({
          page: 1
        })
        .set('Authorization', `Bearer ${token}`)
      const recipeID = getAllRecipesRequest.body.recipes[0].id
      const newRecipeTitle = 'novo titulo pro bolinho de chuva'

      const updateRecipeRequest = await request(app)
        .put(`/recipes/${recipeID}`)
        .send({
          title: newRecipeTitle
        })
        .set('Authorization', `Bearer ${token}`)

      expect(updateRecipeRequest.status).toBe(200)
    })

    test('failure to update recipe to not provided field and return status 406 and error in body.error name and message by database error', async () => {
      const getAllRecipesRequest = await request(app)
        .get('/recipes')
        .send({
          page: 1
        })
        .set('Authorization', `Bearer ${token}`)
      const recipeID = getAllRecipesRequest.body.recipes[0].id

      const badRequestUpdateRecipe = await request(app)
      .put(`/recipes/${recipeID}`)
      .send({})
      .set('Authorization', `Bearer ${token}`)

      expect(badRequestUpdateRecipe.status).toBe(406)
      expect(badRequestUpdateRecipe.body.error.name).toBe('Database Error')
      expect(badRequestUpdateRecipe.body.error.message).toBe('Empty .update() call detected! Update data does not contain any values to update. This will result in a faulty query. Table: recipe. Columns: title,time,number_of_portions,preparation_mode,observations.')
    })

    test('failure update recipe by invalid token and return status 401', async () => {
      const getAllRecipesRequest = await request(app)
        .get('/recipes')
        .send({
          page: 1
        })
        .set('Authorization', `Bearer ${token}`)
      const recipeID = getAllRecipesRequest.body.recipes[0].id
      const newRecipeTitle = 'sou um novo titulo'

      const badRequestUpdateRecipe = await request(app)
        .put(`/recipes/${recipeID}`)
        .send({
          title: newRecipeTitle
        })

      expect(badRequestUpdateRecipe.status).toBe(401)
    })

    test('delete a recipe with recipe ID and user token and return status 200', async () => {
      const getAllRecipesRequest = await request(app)
        .get('/recipes')
        .send({
          page: 1
        })
        .set('Authorization', `Bearer ${token}`)
      const recipeID = getAllRecipesRequest.body.recipes[0].id
      
      const deleteRecipeRequest = await request(app)
        .delete(`/recipes/${recipeID}`)
        .set('Authorization', `Bearer ${token}`)

      expect(deleteRecipeRequest.status).toBe(200)
    })
  })
})