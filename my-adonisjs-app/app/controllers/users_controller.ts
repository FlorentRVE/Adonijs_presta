import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Job from '#models/job'
import * as fs from 'fs'
import { cuid } from '@adonisjs/core/helpers'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.findManyBy('is_admin', false)
    return response.ok({ Users: users })
  }

  async getById({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.badRequest({ message: "User don't exist" })
    }
    return response.ok({ User: user })
  }

  async deleteById({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.badRequest({ message: "User don't exist" })
    }

    user.delete()

    return response.ok({ message: 'User deleted' })
  }

  async updateById({ params, request, response }: HttpContext) {

    let enabledBDD = false
    let is_adminBDD = false

    try {
      const email = request.input('email')
      const password = request.input('password')
      const name = request.input('name')
      const area = request.input('area')
      const tel = request.input('tel')
      const job = request.input('job')
      const enabled = request.input('enabled')
      const is_admin = request.input('is_admin')

      if (!email || !password || !name || !area || !tel || !job || !enabled || !is_admin) {
        return response.badRequest({ message: 'All fields are required' })
      }

      //check user
      const userExist = await User.find(params.id)

      if (!userExist) {
        return response.badRequest({ message: "User don't exist" })
      }

      //check job
      const jobExist = await Job.findBy('id', job)

      if (!jobExist) {
        return response.badRequest({ message: 'Job not exist' })
      }

      // assign Bool if true
      if (enabled === 'true') {
        enabledBDD = true
      }

      if (is_admin === 'true') {
        is_adminBDD = true
      }

      // updated user
      userExist.email = email
      userExist.password = password
      userExist.name = name
      userExist.area = area
      userExist.tel = tel
      userExist.job_id = job
      userExist.enabled = enabledBDD
      userExist.is_admin = is_adminBDD

      await userExist.save()

      return response.created({ message: 'User updated' })

    } catch (error) {

      return response.internalServerError({
        message: 'Something went wrong during registration',
        error: error,
      })
    }
  }

  async changeAvatarById({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.badRequest({ message: "User don't exist" })
    }

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

  async changePasswordById({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.badRequest({ message: "User don't exist" })
    }

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
