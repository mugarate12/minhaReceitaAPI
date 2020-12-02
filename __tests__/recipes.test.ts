import request from 'supertest'

import app from './../src/app'
import { RecipeRepository } from './../src/repositories'

describe('Recipes cases', () => {
  const user = {
    email: 'meuusuarioReceitaRecipeCases@gmail.com',
    name: 'MateusReceita',
    password: 'minhasenha123'
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
    return await getToken()
  })

  describe('create recipe cases', () => {
    test('create recipe', async () => {
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

    test('failure to create recipe to celebrate error', async () => {
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

    test('failure to create recipe to token not provided or invalid ', async () => {
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
  })

  describe('get recipe cases', () => {
    test('get all recipes with a user', async () => {
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

    test('get one recipe of a user and recipeID', async () => {
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

    test('failure to get recipes to token not provided or invalid', async () => {
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
  })

  describe('update recipe cases', () => {
    test('sucessful update recipe', async () => {
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

    test('failure update recipe for database error to empty fields', async () => {
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

    test('failure update recipe for not valid ID param', async () => {
      const newRecipeTitle = 'sou um novo titulo'

      const badRequestUpdateRecipe = await request(app)
        .put(`/recipes/string`)
        .send({
          title: newRecipeTitle
        })
        .set('Authorization', `Bearer ${token}`)

      expect(badRequestUpdateRecipe.status).toBe(400)
    })

    test('failure update recipe for token not provided', async () => {
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
  })

  describe('delete recipe cases', () => {
    test('sucessful delete recipe', async () => {
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

    test('failure delete recipe for not valid id param', async () => {
      const invalidID = 'sou um id invalido'

      const deleteRecipeRequest = await request(app)
        .delete(`/recipes/${invalidID}`)
        .set('Authorization', `Bearer ${token}`)

      expect(deleteRecipeRequest.status).toBe(400)
    })
  })
})