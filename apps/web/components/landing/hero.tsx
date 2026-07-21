"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { DashboardPreview } from "./dashboard-preview"

import { hero } from "@/data/landing"
import { technologies } from "@/data/technologies"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary">
            {hero.badge}
          </Badge>

          <h1 className="mt-8 text-5xl font-bold tracking-tight lg:text-7xl">
            {hero.title}
          </h1>

          <p className="mt-4 text-2xl font-medium text-stone-700">
            {hero.highlight}
          </p>

          <p className="mt-8 max-w-xl text-lg leading-8 text-stone-600">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href={hero.primaryButton.href}>
                {hero.primaryButton.title}
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
            >
              <Link href={hero.secondaryButton.href}>
                {hero.secondaryButton.title}
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {technologies.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </motion.div>

        <DashboardPreview />

      </div>
    </section>
  )
}