import * as Knex from "knex"
import { TABLE_RECIPE } from './../types'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_RECIPE, (table) => {
    table.increments('id').primary()

    table.string('title')
    table.string('time')
    table.integer('number_of_portions')
    table.text('preparation_mode')
    table.text('observations')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_RECIPE)
}

