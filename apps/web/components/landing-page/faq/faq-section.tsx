"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, GitBranch, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionHeader } from "@/components/shared-ui/marketing/marketing-section-header";
import { cn } from "@/lib/class-name";

const faqs = [
  {
    question: "What exactly does StreamiX handle?",
    answer:
      "StreamiX is a self-hosted video processing pipeline. It accepts uploads, stores the source, queues a transcoding job over Redis Streams, runs FFprobe and FFmpeg in a Go worker, and exposes the resulting HLS playlists and thumbnail through the API and dashboard.",
  },
  {
    question: "Which source files can I upload?",
    answer:
      "The dashboard accepts MP4, WebM, and MOV files. The API enforces a 2 GB upload limit. Each source is probed before transcoding, and the rendition ladder adapts to the source resolution instead of upscaling.",
  },
  {
    question: "What does the pipeline produce?",
    answer:
      "A master HLS playlist with 1080p, 720p, and 480p variants when the source supports them, plus a 240p fallback for low-resolution sources. It also generates a JPEG thumbnail from the video.",
  },
  {
    question: "How does playback access work?",
    answer:
      "The owner requests a short-lived playback session, which returns a video-scoped signed HLS URL. The API validates that token on every playlist, segment, and thumbnail request, so native players and plain media URLs work without an Authorization header. Expired sessions can be renewed by the dashboard.",
  },
  {
    question: "Where is media stored?",
    answer:
      "On the local filesystem by default, namespaced by user and video. Storage is behind an interface, but an S3-compatible driver is not implemented in the current build.",
  },
  {
    question: "What happens when a job fails?",
    answer:
      "Transient failures remain pending and are reclaimed after the configured queue idle threshold. Jobs that exceed the retry window are marked failed, and permanent failures fail immediately. The status is visible in the dashboard and through the status endpoint.",
  },
  {
    question: "Is there a hosted version?",
    answer:
      "No. StreamiX is a public repository that you run yourself. CDN delivery, object storage, autoscaled workers, and live streaming are not part of the current build.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <MarketingSection id="faq" className="border-b border-border/70 bg-muted/20">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <MarketingSectionHeader
            align="left"
            badge="FAQ"
            title="Questions, answered directly."
            description="The current build is deliberately small. These answers describe what ships, not what is planned."
          />

          <div className="mt-9 flex flex-col gap-3 border-t border-border pt-6">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground transition-colors hover:text-primary"
            >
              Read the setup guide
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="https://github.com/shivamx64/StreamiX/issues"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <GitBranch className="h-3.5 w-3.5" />
              Open an issue
            </Link>
          </div>
        </div>

        <div className="border-t border-border">
          {faqs.map((faq, index) => {
            const open = openIndex === index;

            return (
              <div key={faq.question} className="border-b border-border">
                <button
                  type="button"
                  id={`faq-button-${index}`}
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${index}`}
                  className="group flex w-full items-start gap-4 py-5 text-left md:gap-5 md:py-6"
                >
                  <span className="mt-1 w-5 shrink-0 font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={cn(
                      "flex-1 text-[15px] font-medium tracking-[-0.015em] transition-colors md:text-base",
                      open
                        ? "text-foreground"
                        : "text-foreground group-hover:text-primary",
                    )}
                  >
                    {faq.question}
                  </span>

                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-0.5 shrink-0"
                  >
                    <Plus
                      className={cn(
                        "h-4 w-4",
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
                      initial={
                        reduceMotion ? false : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p className="max-w-2xl pb-6 pl-9 pr-8 text-[13px] leading-6 text-muted-foreground md:pl-10 md:text-sm md:leading-7">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </MarketingSection>
  );
}
