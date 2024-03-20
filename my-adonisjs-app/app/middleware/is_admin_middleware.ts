import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const userAuth = ctx.auth.user

    if(!userAuth) {
      return ctx.response.unauthorized()
    }

    if(!userAuth.is_admin) {
      return ctx.response.unauthorized({ message: 'You are not authorized to perform this action' })
    }

    /**
     * Call next method in the pipeline and return its output
     */    
    return next()
  }
}