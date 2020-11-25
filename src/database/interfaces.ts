export interface UsersInterface {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface BlacklistTokenInterface {
  id: number;
  token: string;
}

export interface RecipeInterface {
  id: number;
  title: string;
  time: string;
  number_of_portions: number;
  preparation_mode: string;
  observations: string;
  userIDFK: string;
}

export interface IngredientsInterface {
  name: string;
  measure: string;
  recipeIDFK: number;
}
