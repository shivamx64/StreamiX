import type { ReactNode } from "react"

import { Navbar } from "@/components/landing/navbar"

export default function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>
    </>
  )
}