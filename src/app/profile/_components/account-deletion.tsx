'use client'

import { BetterAuthActionButton } from '@/components/shared/better-auth-action-button'
import { deleteUser } from '@/lib/auth-client'

export function AccountDeletion() {
  return (
    <BetterAuthActionButton
      requireAreYouSure
      variant='destructive'
      className='w-full'
      successMessage='Account deletion initiated. Please check your email to confirm.'
      action={() => deleteUser({ callbackURL: '/' })}
    >
      Delete Account Permanently
    </BetterAuthActionButton>
  )
}
