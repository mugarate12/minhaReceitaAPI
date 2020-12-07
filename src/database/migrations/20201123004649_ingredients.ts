import * as Knex from "knex"
import { TABLE_INGREDIENTS, TABLE_RECIPE } from './../types'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_INGREDIENTS, (table) => {
    table.increments('id').primary()

    table.string('name').notNullable()
    table.string('measure').notNullable()
    table.integer('recipeIDFK').unsigned()

    table.foreign('recipeIDFK').references('id').inTable(TABLE_RECIPE)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_INGREDIENTS)
}
