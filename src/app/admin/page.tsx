import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect /admin to /admin/menu
  redirect('/admin/menu')
}