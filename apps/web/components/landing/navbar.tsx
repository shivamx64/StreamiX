"use client"

import Link from "next/link"

import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/common/logo"

import { navigation } from "@/data/navigation"

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
      sticky
      top-0
      z-50
      border-b
      border-stone-200/80
      bg-white/80
      backdrop-blur-xl
      "
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="
              text-sm
              text-stone-600
              transition-colors
              hover:text-black
              "
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">

          <Button
            variant="ghost"
            asChild
          >
            <Link href="/login">
              Sign in
            </Link>
          </Button>

          <Button asChild>
            <Link href="/dashboard">
              Launch App
            </Link>
          </Button>

        </div>

      </div>
    </motion.header>
  )
}