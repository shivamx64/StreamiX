"use client"

import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.2,
      }}
    >
      <Card className="overflow-hidden rounded-3xl border bg-white shadow-2xl">
        <div className="border-b px-6 py-4">
          <h3 className="font-semibold">
            Processing Queue
          </h3>

          <p className="text-sm text-stone-500">
            Live worker activity
          </p>
        </div>

        <div className="space-y-5 p-6">

          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span>movie.mp4</span>
              <span>84%</span>
            </div>

            <div className="h-2 rounded-full bg-stone-200">
              <div className="h-full w-[84%] rounded-full bg-stone-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <Card className="p-4">
              <p className="text-sm text-stone-500">
                Workers
              </p>

              <p className="mt-2 text-3xl font-bold">
                4
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-sm text-stone-500">
                Queue
              </p>

              <p className="mt-2 text-3xl font-bold">
                21
              </p>
            </Card>

          </div>

          <Card className="p-4">
            <p className="text-sm text-stone-500">
              Storage
            </p>

            <p className="mt-2 text-2xl font-semibold">
              2.3 TB
            </p>
          </Card>

        </div>
      </Card>
    </motion.div>
  )
}