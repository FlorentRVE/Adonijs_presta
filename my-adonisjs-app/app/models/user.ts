import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column()
  declare area: string

  @column()
  declare job_id: number

  @column()
  declare tel: string

  @column()
  declare avatar: string

  @column()
  declare enabled: boolean

  @column()
  declare is_admin: boolean

  @column()
  declare password: string

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
