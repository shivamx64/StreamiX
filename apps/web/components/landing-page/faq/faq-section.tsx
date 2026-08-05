"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionHeader } from "@/components/shared-ui/marketing/marketing-section-header";
import { cn } from "@/lib/class-name";

const faqs = [
  {
    question: "What video formats can I upload?",
    answer:
      "StreamiX accepts common container formats including MP4, MOV, MKV, and WebM. Every upload is probed automatically and transcoded into a standardized HLS output.",
  },
  {
    question: "How does distributed transcoding work?",
    answer:
      "Uploads are pushed onto a Redis-backed job queue, where a fleet of worker services pick them up and run FFmpeg jobs in parallel. Jobs fan out across workers so large batches finish in minutes, not hours.",
  },
  {
    question: "What streaming outputs do you generate?",
    answer:
      "We generate adaptive bitrate HLS playlists with multiple resolutions — typically 480p, 720p, and 1080p — so playback adapts to each viewer's connection in real time.",
  },
  {
    question: "How long does processing take?",
    answer:
      "It depends on the source file, but most videos complete in under a minute thanks to parallel worker pools. You can watch progress live in the dashboard.",
  },
  {
    question: "Is my content secure?",
    answer:
      "Yes. Accounts are protected with JWT authentication, files live in private object storage, and only you can access your library and generated streams.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. The Starter plan is free forever and includes everything you need to try the platform. Upgrade to Pro whenever you're ready.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <MarketingSection id="faq" className="bg-muted/40">
      <MarketingSectionHeader
        badge="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about the platform. Can't find an answer? Reach out and we'll help."
      />

      <div className="mx-auto mt-16 max-w-3xl border-t border-border/70">
        {faqs.map((faq, index) => {
          const open = openIndex === index;

          return (
            <div key={faq.question} className="border-b border-border/70">
              <button
                type="button"
                id={`faq-button-${index}`}
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                aria-controls={`faq-panel-${index}`}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span
                  className={cn(
                    "text-base font-medium transition-colors",
                    open ? "text-primary" : "text-foreground",
                  )}
                >
                  {faq.question}
                </span>

                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <Plus
                    className={cn(
                      "h-5 w-5",
                      open ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <p className="pb-6 pr-10 text-sm leading-7 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </MarketingSection>
  );
}