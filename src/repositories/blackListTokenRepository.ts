import connection from './../database/connection'
import { TABLE_BLACKLIST_TOKEN } from './../database/types'
import { BlacklistTokenInterface } from './../database/interfaces'

export default class BlackListTokenRepository {
  private blackListToken

  constructor() {
    this.blackListToken = connection<BlacklistTokenInterface>(TABLE_BLACKLIST_TOKEN)
  }

  public create = async (token: string) => {
    await this.blackListToken
      .insert({
        token: token
      })
  }

  public get = async (token: string) => {
    return await this.blackListToken
      .select('token')
      .where({
        token
      })
      .first()
      .then(token => token)
      .catch(err => {
        throw new err
      })
  }
  
}