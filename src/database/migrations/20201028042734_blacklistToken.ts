import * as Knex from "knex";
import { TABLE_BLACKLIST_TOKEN } from './../types'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_BLACKLIST_TOKEN, (table) => {
    table.increments('id').primary()

    table.string('token')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_BLACKLIST_TOKEN)
}

