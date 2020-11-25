import * as Knex from "knex"
import { TABLE_RECIPE, TABLE_USERS_NAME } from './../types'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_RECIPE, (table) => {
    table.increments('id').primary()

    table.string('title').notNullable()
    table.string('time').notNullable()
    table.integer('number_of_portions').notNullable()
    table.text('preparation_mode').notNullable()
    table.text('observations').notNullable()

    table.string('userIDFK').notNullable()

    table.foreign('userIDFK').references('id').inTable(TABLE_USERS_NAME)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_RECIPE)
}

