'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'

import { FormInput } from '@/components/form/form-base'
import { LoadingSwap } from '@/components/shared/loading-swap'
import { useRouter } from 'next/navigation'
import { changeEmail, updateUser } from '@/lib/auth-client'

const profileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.email('Please enter a valid email address!')
})

type ProfileSchemaType = z.infer<typeof profileSchema>

interface ProfileUpdateFormProps {
  onSuccess?: () => void
}

export function ProfileUpdateForm({
  user
}: {
  user: {
    email: string
    name: string
  }
}) {
  const router = useRouter()
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: user
  })
  const { isSubmitting } = form.formState

  async function handleProfileUpdate(data: ProfileSchemaType) {
    const promises = [
      updateUser({
        name: data.name
      })
    ]

    if (data.email !== user.email) {
      promises.push(
        changeEmail({
          newEmail: data.email,
          callbackURL: '/profile'
        })
      )
    }

    const res = await Promise.all(promises)

    const updateUserResult = res[0]
    const emailResult = res[1] ?? { error: false }

    if (updateUserResult.error) {
      toast.error(updateUserResult.error.message || 'Failed to update profile')
    } else if (emailResult.error) {
      toast.error(emailResult.error.message || 'Failed to change email')
    } else {
      if (data.email !== user.email) {
        toast.success('Verify your new email address to complete the change.')
      } else {
        toast.success('Profile updated successfully')
      }
      router.refresh()
    }
  }

  return (
    <Card className='w-full sm:max-w-[465px]'>
      <CardHeader className='text-center'>
        <CardTitle>Update your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id='profile-update-form'
          onSubmit={form.handleSubmit(handleProfileUpdate)}
        >
          <FieldGroup>
            <FormInput control={form.control} name='name' label='Name' />
            <FormInput control={form.control} name='email' label='Email' />
            <h3 className='text-xs text-red-600'>
              A request to change email will need to be verified from your
              existing email address and new email address.
            </h3>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation='horizontal' className='justify-between'>
          <Button
            type='submit'
            form='profile-update-form'
            className='w-full max-w-[150px] cursor-pointer dark:bg-blue-600 dark:text-white'
            disabled={isSubmitting}
          >
            <LoadingSwap isLoading={isSubmitting}>Submit</LoadingSwap>
          </Button>
          <Button
            className='border-red-500'
            type='button'
            form='profile-update-form'
            variant='outline'
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
