import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.string('name').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('area', 25).notNullable()
      table.string('tel', 10).notNullable()
      table.string('avatar').notNullable()
      table.boolean('enabled').defaultTo(false)
      table.boolean('is_admin').defaultTo(false)
      table.string('password').notNullable()
      
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}