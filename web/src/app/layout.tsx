import type { Metadata } from 'next'
import { Anton, Inter_Tight } from 'next/font/google'
import './globals.css'

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
})

const anton = Anton({
  variable: '--font-anton',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Coach AI',
  description: 'O app que vai transformar a forma como você treina.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.className} ${anton.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
