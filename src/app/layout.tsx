import './globals.css'
import { SessionProvider } from '@/components/SessionProvider'

export const metadata = {
  title: 'AI Restaurant Demo',
  description: 'Restaurant Menu & Order Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}