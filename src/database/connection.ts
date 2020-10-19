import knex from 'knex'
import configuration from './../../knexfile'

let config
if (process.env.NODE_ENV === 'test') {
  config = configuration.test
} else if (process.env.NODE_ENV === 'development') {
  config = configuration.development
} else {
  config = configuration.production
}

const connection = knex(config)

export default connection
