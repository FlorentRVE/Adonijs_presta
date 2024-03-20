import Job from '#models/job'
import type { HttpContext } from '@adonisjs/core/http'

export default class JobsController {
  async index({ response }: HttpContext) {
    return response.ok({ Jobs: await Job.all() })
  }

  async new({ request, response }: HttpContext) {
    try {
      const jobFromForm = request.input('job')
      const jobExist = await Job.findBy('name', jobFromForm)

      if(jobExist) {
        return response.badRequest({message: 'Job already exist'})
      }

      const newJob = await Job.create({
        name: jobFromForm
      })

      return response.ok({message: 'Job created', newJob: newJob})

      
    } catch (error) {
        return response.internalServerError({message: 'An error occured', error: error})
    }
  }
}
