import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password - Silent Star',
  description: 'Set a new Silent Star account password.',
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
