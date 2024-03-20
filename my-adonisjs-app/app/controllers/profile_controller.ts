import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import * as fs from 'fs'
import Job from '#models/job'

export default class UsersController {
  async profile({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const { password, enabled, is_admin, ...userInfo } = user.$attributes
    return response.ok(userInfo)
  }

  async changeProfile({ auth, response, request }: HttpContext) {

    const user = await auth.authenticate()

    const email = request.input('email')
    const name = request.input('name')
    const area = request.input('area')
    const tel = request.input('tel')
    const job = request.input('job')

    if (!email || !name || !area || !tel || !job) {
      return response.badRequest({ message: 'All fields are required' })
    }

    //check job
    const jobExist = await Job.findBy('id', job)

    if (!jobExist) {
      return response.badRequest({ message: 'Job not exist' })
    }

    // update user  
      user.email = email,
      user.name = name,
      user.area = area,
      user.tel = tel,
      user.job_id = jobExist.id,

    await user.save()

    return response.created({ message: 'Profile updated' })
  }

  async changeAvatar({ auth, response, request }: HttpContext) {
    const user = await auth.authenticate()

    try {
      // check image
      const avatar = request.file('avatar', {
        extnames: ['png', 'jpg', 'jpeg'],
        size: '4mb',
      })

      if (!avatar || !avatar.isValid) {
        return response.badRequest({ message: 'Invalid image' })
      }

      // delete old avatar
      const oldAvatar = user.avatar
      fs.unlink(`public/uploads/${oldAvatar}`, (err) => {
        if (err) throw err
        console.log('avatar deleted')
      })

      // save new avatar
      const filename = `${cuid()}.${avatar.extname}`
      user.avatar = filename

      await avatar.move('public/uploads', { name: filename })
      user.save()

      return response.created({ message: 'Avatar updated' })
    } catch (error) {
      return response.internalServerError({
        message: 'Something went wrong during registration',
        error: error,
      })
    }
  }
  async changePassword({ auth, response, request }: HttpContext) {
    const user = await auth.authenticate()

    try {
      // check password
      const password = request.input('password')

      if (!password) {
        return response.badRequest({ message: 'Password is required' })
      }

      user.password = password
      user.save()

      return response.created({ message: 'Password updated' })
    } catch (error) {
      return response.internalServerError({
        message: 'Something went wrong during registration',
        error: error,
      })
    }
  }
}
