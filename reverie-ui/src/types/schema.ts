import { z } from 'zod'

const passwordRegex = /^(?=.*[0-9])(?=.*[!~#%{}^&*+=-?<>€$@])[a-zA-Z0-9!~#%{}^&*+=-?<>€$@]{8,30}$/gm

const usernameRegex = /^[a-zA-Z0-9!~#%{}^&*+=-?<>€$@]{4,}$/gm

const BaseUser = z.object({
  id: z.string().min(25),
  username: z.string().trim().regex(usernameRegex),
  email: z.string().email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  message: z.string().min(13),
  access: z.string().includes('.').trim().min(80),
  refresh: z.string().includes('.').trim().min(80),
  refreshToken: z.string().trim().min(10),
  password: z.string().trim().regex(passwordRegex),
  confirm: z.string().trim().regex(passwordRegex),
})

const Signup = BaseUser.pick({
  username: true,
  email: true,
  password: true,
  confirm: true,
}).superRefine(({ confirm, password }, ctx) => {
  if (confirm !== password) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords unmatch!',
    })
  }
})

const SignupResponse = BaseUser.pick({ message: true }).strict()

const Login = BaseUser.pick({
  email: true,
  password: true,
}).strict()

const LoginResponse = BaseUser.pick({
  message: true,
  access: true,
  refresh: true,
}).strict()

const RefreshToken = BaseUser.pick({
  refreshToken: true,
}).strict()

const BasePost = z.object({
  id: z.string().min(25),
  title: z.string().trim().min(5),
  description: z.string().min(10),
  entry: z.string().min(10),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  message: z.string().min(4),
})

const CreatePost = BasePost.pick({
  title: true,
  description: true,
  entry: true,
}).strict()

const UpdatePost = BasePost.pick({
  title: true,
  description: true,
  entry: true,
}).optional()

const InitPost = BasePost.omit({
  message: true,
})

const Post = InitPost.extend({
  user: z.object({
    id: z.string().min(25),
    username: z.string().trim().regex(usernameRegex),
    email: z.string().email(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    posts: z.array(InitPost).optional(),
  }),
})

const InitUser = BaseUser.omit({
  password: true,
  confirm: true,
  message: true,
  refresh: true,
  access: true,
  refreshToken: true,
})

const User = InitUser.extend({
  posts: z.array(Post).optional(),
})

const schema = {
  BaseUser,
  Signup,
  LoginResponse,
  SignupResponse,
  CreatePost,
  Login,
  RefreshToken,
  User,
  BasePost,
  UpdatePost,
  Post,
}

export default schema
