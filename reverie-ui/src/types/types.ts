import { z } from 'zod'

import schema from './schema'

export type _Signup = z.infer<typeof schema.Signup>

export type SignupResponse = z.infer<typeof schema.SignupResponse>

export type _Login = z.infer<typeof schema.Login>

export type LoginResponse = z.infer<typeof schema.LoginResponse>

export type User = z.infer<typeof schema.User>

export type CreatePost = z.infer<typeof schema.CreatePost>

export type UpdatePost = z.infer<typeof schema.UpdatePost>

export type PartialUser = z.infer<typeof schema.PartialUser>

export type Post = z.infer<typeof schema.Post>

export type UpdatePostResponse = z.infer<typeof schema.UpdatePostResponse>
