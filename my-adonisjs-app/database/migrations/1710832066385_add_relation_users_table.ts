import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // update the users table
    this.schema.table(this.tableName, (table) => {
      table.integer('job_id').unsigned().references('jobs.id').index()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
