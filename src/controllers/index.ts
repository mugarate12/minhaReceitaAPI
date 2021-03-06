import UserController from './usersController'
import SessionController from './sessionController'
import RecipesController from './recipesController'
import IngredientsController from './ingredientsController'
import PublicUsersController from './publicUsersController'
import PublicRecipesController from './publicRecipesController'

export const userController = new UserController()
export const sessionController = new SessionController()
export const recipesController = new RecipesController()
export const ingredientsController = new IngredientsController()
export const publicUsersController = new PublicUsersController()
export const publicRecipesController = new PublicRecipesController()
