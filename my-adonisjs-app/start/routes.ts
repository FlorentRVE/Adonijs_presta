/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Auth
router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')
router
  .post('/logout', '#controllers/auth_controller.logout')
  .use(middleware.auth({ guards: ['api'] }))

// Profile
router
  .group(() => {
    router.get('/profile', '#controllers/profile_controller.profile')
    router.patch('/profile', '#controllers/profile_controller.changeProfile')
    router.patch('/profile/avatar', '#controllers/profile_controller.changeAvatar')
    router.patch('/profile/password', '#controllers/profile_controller.changePassword')
  })
  .use(middleware.auth({ guards: ['api'] }))

// Jobs
router.get('/jobs', '#controllers/jobs_controller.index')
router.post('/jobs/new', '#controllers/jobs_controller.new')

// Admin
router
  .group(() => {
    router.get('/users', '#controllers/users_controller.index')
    router.get('/user/:id', '#controllers/users_controller.getById')
    router.delete('/user/:id', '#controllers/users_controller.deleteById')
    router.patch('/user/:id', '#controllers/users_controller.updateById')
    router.patch('/user/:id/avatar', '#controllers/users_controller.changeAvatarById')
    router.patch('/user/:id/password', '#controllers/users_controller.changePasswordById')
  })
  .prefix('/admin')
  .use([middleware.auth({ guards: ['api'] }), middleware.isAdmin()])
