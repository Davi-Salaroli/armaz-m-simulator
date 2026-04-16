import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Simulador de Parcelamento - Armazém Bikes",
  description: "Calcule as parcelas e compartilhe com seus clientes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body>{children}</body>
    </html>
  )
}
