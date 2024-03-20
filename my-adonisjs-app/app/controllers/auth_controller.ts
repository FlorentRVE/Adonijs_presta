import Job from "#models/job";
import User from "#models/user";
import { cuid } from "@adonisjs/core/helpers";
import { HttpContext } from "@adonisjs/core/http";
import hash from "@adonisjs/core/services/hash";


export default class AuthController {
    async register({request, response}: HttpContext) {
        try {
            const email = request.input('email')
            const password = request.input('password')
            const name = request.input('name')
            const area = request.input('area')
            const tel = request.input('tel')
            const job = request.input('job')

            if (!email || !password || !name || !area || !tel || !job) {
                return response.badRequest({message: 'All fields are required'})
            }

            //check user
            const userExist = await User.findBy('email', email)
            if(userExist) {
                return response.badRequest({message: 'User already exist'})
            }

            //check job
            const jobExist = await Job.findBy('id', job)

            if(!jobExist) {
                return response.badRequest({message: 'Job not exist'})
            }

            // check image
            const avatar = request.file('avatar', {
                extnames: ['png', 'jpg', 'jpeg'],
                size: '4mb'
            })

            if(!avatar || !avatar.isValid) {
                return response.badRequest({message: 'Invalid image'})
                
            }

            const filename = `${cuid()}.${avatar.extname}`

            // création 
            const user = await User.create({
              email: email,
              password: password,
              name: name,
              area: area,
              tel: tel,
              avatar: filename,
              job_id: jobExist.id,
              enabled: true,
              is_admin: false
            })

            await user.save()
            await avatar.move('public/uploads', {name: filename})

            return response.created({message: 'User created'})

        } catch (error) {
            console.log(error)
            return response.internalServerError({message: 'Something went wrong during registration', error: error})

        }
    }

    async login({request, response}: HttpContext) {
        try {
            const email = request.input('email')
            const password = request.input('password')
        
            if (!email || !password) {
                return response.badRequest({message: 'All fields are required'})
            }

            const user = await User.findBy('email', email)

            if(!user) {
                return response.badRequest({message: 'User not found'})
            }

            
            const isValid = await hash.verify(user.password, password)
            if(!isValid) {
                return response.badRequest({message: 'Invalid credentials'})
            }

            if(!user.enabled) {
                return response.unauthorized({ error: 'Your account is not verified' })
            }

            const token = await User.accessTokens.create(user)

            const tokenValue = token.value!.release()

            return response.ok({message: 'Login successful', token : tokenValue})
            
        } catch (error) {
            console.log(error)
            return response.internalServerError({message: 'Something went wrong during login'})
        }
    }

    async logout({ auth, response }: HttpContext) {
        try {
        User.accessTokens.delete(
            auth.user as User,
            auth.user?.currentAccessToken?.identifier as string
        )
        return response.ok({ message: 'Logged out' })
        } catch (error) {
        console.log(error)
        return response.internalServerError({ message: 'An error occured during logout' })
        }
    } 
}