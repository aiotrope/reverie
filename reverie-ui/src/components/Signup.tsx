import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import Stack from 'react-bootstrap/Stack'
import FormControl from 'react-bootstrap/FormControl'

import httpService from '../services/http'
import { userKeys } from '../services/queryKeyFactory'
import { SignupType, SignupSchema } from '../schema/schema'

const Signup: React.FC = () => {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: httpService.signup,
    onSuccess: (data) => {
      reset()
      toast.success(`${data?.message}`)
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })
    },
    onError: (error, context) => {
      toast.error(`${error.message}: ${context}`)
    },
  })

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
    mode: 'all',
  })

  const onSubmit = async (input: SignupType) => {
    const result = await mutate.mutateAsync(input)
    return result
  }

  return (
    <Stack>
      <h2>Signup for an account</h2>
      <form onSubmit={handleSubmit(onSubmit)} spellCheck="false" noValidate>
        <div className="grid">
          <label htmlFor="username">
            Username
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              {...register('username')}
              aria-invalid={!errors.username?.message && isDirty ? 'false' : 'true'}
              className={`${errors.username?.message ? 'is-invalid' : ''} `}
              required
            />
            {errors.username?.message && (
              <FormControl.Feedback type="invalid">{errors.username?.message}</FormControl.Feedback>
            )}
          </label>

          <label htmlFor="email">
            Email
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              {...register('email')}
              aria-invalid={!errors.email?.message && isDirty ? 'false' : 'true'}
              className={`${errors.email?.message ? 'is-invalid' : ''} `}
              required
            />
            {errors.email?.message && (
              <FormControl.Feedback type="invalid">{errors.email?.message}</FormControl.Feedback>
            )}
          </label>
        </div>
        <div className="grid">
          <label htmlFor="password">
            Password
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              {...register('password')}
              aria-invalid={!errors.password?.message && isDirty ? 'false' : 'true'}
              className={`${errors.password?.message ? 'is-invalid' : ''} `}
              required
            />
            {errors.password?.message && (
              <FormControl.Feedback type="invalid">{errors.password?.message}</FormControl.Feedback>
            )}
          </label>

          <label htmlFor="confirm">
            Password confirmation
            <input
              type="confirm"
              id="confirm"
              placeholder="Repeat password"
              {...register('confirm')}
              aria-invalid={!errors.confirm?.message && isDirty ? 'false' : 'true'}
              className={`${errors.confirm?.message ? 'is-invalid' : ''} `}
              required
            />
            {errors.confirm?.message && (
              <FormControl.Feedback type="invalid">{errors.confirm?.message}</FormControl.Feedback>
            )}
          </label>
        </div>
        <button aria-busy={mutate.isPending}>Submit</button>
      </form>
    </Stack>
  )
}

export default Signup
