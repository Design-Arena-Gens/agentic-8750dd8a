import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medyar - Medical AI Tutor',
  description: 'Interactive AI-driven medical case simulator for students',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <div className="container py-8">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Medyar</h1>
            <nav className="flex gap-3 text-sm text-white/80">
              <a href="/" className="hover:text-white">Home</a>
              <a href="/session" className="hover:text-white">Start Case</a>
            </nav>
          </header>
          {children}
          <footer className="mt-12 text-center text-xs text-white/60">
            For education only - sample data
          </footer>
        </div>
      </body>
    </html>
  )
}
