import Link from 'next/link'
import { ForgotPasswordForm } from './_components/forgot-password-form'
import { ArrowLeftIcon } from 'lucide-react'

const ForgotPasswordPage = async () => {
  return (
    <div className='flex min-h-[80vh] items-center justify-center'>
      <div className='flex flex-col'>
        <Link href='/' className='mt-12 mb-6 inline-flex items-center'>
          <ArrowLeftIcon suppressHydrationWarning className='mr-2 size-4' />
          Back to Home
        </Link>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
