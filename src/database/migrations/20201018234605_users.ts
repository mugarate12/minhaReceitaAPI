import * as Knex from "knex"
import { TABLE_USERS_NAME } from './../types'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_USERS_NAME, (table) => {
    table.string('id').primary()

    table.string('name')
    table.string('email').unique()
    table.string('password')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_USERS_NAME)
}

