import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password - Silent Star',
  description: 'Request a Silent Star password reset email.',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
