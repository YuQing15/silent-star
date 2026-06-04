import type { Metadata } from 'next'
import { AdminLoginForm } from '@/components/admin/AdminPreviewGate'

export const metadata: Metadata = {
  title: 'Admin Login - Silent Star',
  description: 'Temporary admin preview password gate for Silent Star.',
}

export default function AdminLoginPage() {
  return <AdminLoginForm />
}
