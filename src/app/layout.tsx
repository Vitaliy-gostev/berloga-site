import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Ветеринарная клиника Берлога — Круглосуточно в Москве',
  description: 'Ветеринарная клиника Берлога — круглосуточная помощь для ваших питомцев. УЗИ, хирургия, терапия, стоматология, вакцинация. Москва, ул. Пилюгина 6.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
