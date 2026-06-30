import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Video } from "lucide-react";

import { LoginForm } from "@/features/auth/components/login-form";

const features = [
  {
    icon: Video,
    title: "Distributed Transcoding",
    description:
      "Upload once and process videos through a scalable worker pipeline powered by Go and FFmpeg.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Infrastructure",
    description:
      "JWT authentication, signed uploads, S3 object storage and production-ready security.",
  },
  {
    icon: Sparkles,
    title: "Real-time Processing",
    description:
      "Track transcoding jobs live with WebSockets and monitor every stage from upload to delivery.",
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-orange-700 via-orange-600 to-orange-500 lg:flex">

          <div className="absolute inset-0">
            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-[30rem] w-[30rem] rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative flex h-full w-full flex-col justify-between p-16 text-white">

            <div>

              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">

                  <Video className="h-6 w-6" />

                </div>

                <div>

                  <h2 className="text-2xl font-semibold tracking-tight">
                    StreamiX
                  </h2>

                  <p className="text-sm text-orange-100">
                    Distributed Media Platform
                  </p>

                </div>

              </Link>

              <div className="mt-20 max-w-xl">

                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">

                  Modern Video Infrastructure

                </span>

                <h1 className="mt-8 text-6xl font-semibold leading-tight tracking-tight">

                  Build video
                  <br />
                  infrastructure
                  <br />
                  that scales.

                </h1>

                <p className="mt-8 max-w-lg text-lg leading-8 text-orange-50/90">

                  StreamiX combines distributed workers,
                  FFmpeg, Redis Streams, Kubernetes,
                  PostgreSQL and S3 into one production-grade
                  media processing platform.

                </p>

              </div>

            </div>

            <div className="space-y-5">

              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl"
                >

                  <div className="flex items-start gap-4">

                    <div className="rounded-2xl bg-white/15 p-3">

                      <feature.icon className="h-5 w-5" />

                    </div>

                    <div>

                      <h3 className="font-semibold text-lg">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-orange-100">

                        {feature.description}

                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* RIGHT SIDE */}

        <section className="relative flex items-center justify-center px-6 py-16">

          <div className="absolute inset-0">

            <div className="absolute left-20 top-24 h-64 w-64 rounded-full bg-orange-100 blur-3xl opacity-70" />

            <div className="absolute bottom-24 right-12 h-80 w-80 rounded-full bg-orange-200 blur-3xl opacity-60" />

          </div>

          <div className="relative w-full max-w-md">

            <div className="rounded-[32px] border border-stone-200 bg-white/90 p-10 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl">

              <div className="lg:hidden">

                <Link
                  href="/"
                  className="inline-flex items-center gap-3"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-700 text-white">

                    <Video className="h-6 w-6" />

                  </div>

                  <div>

                    <h2 className="font-semibold text-xl">
                      StreamiX
                    </h2>

                    <p className="text-sm text-stone-500">
                      Distributed Media Platform
                    </p>

                  </div>

                </Link>

              </div>

              <div className="mt-10 lg:mt-0">

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-orange-700">

                  Welcome Back

                </span>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight text-stone-900">

                  Sign in to your account

                </h2>

                <p className="mt-3 text-base leading-7 text-stone-600">

                  Continue building scalable video infrastructure with
                  StreamiX.

                </p>

              </div>

              {/* Login form starts here */}

              <div className="mt-10">
                <LoginForm />
              </div>
                            <div className="mt-8">

                <div className="flex items-center gap-4">

                  <div className="h-px flex-1 bg-stone-200" />

                  <span className="text-xs uppercase tracking-[0.3em] text-stone-400">
                    Secure Authentication
                  </span>

                  <div className="h-px flex-1 bg-stone-200" />

                </div>

              </div>

              <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-700 text-white">

                    <ShieldCheck className="h-5 w-5" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-stone-900">
                      Your data stays protected
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-stone-600">
                      Authentication is secured using Supabase Auth while
                      media assets are uploaded directly to Amazon S3 through
                      signed URLs. Your password is never stored by StreamiX.
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-6">

                <div>

                  <p className="text-sm text-stone-500">
                    Don&apos;t have an account?
                  </p>

                  <Link
                    href="/register"
                    className="mt-1 inline-flex items-center gap-2 font-medium text-orange-700 transition-colors hover:text-orange-800"
                  >
                    Create one now

                    <ArrowRight className="h-4 w-4" />

                  </Link>

                </div>

                <Link
                  href="/"
                  className="text-sm text-stone-500 transition-colors hover:text-stone-800"
                >
                  Back to Home
                </Link>

              </div>

            </div>

            <p className="mt-8 text-center text-sm leading-7 text-stone-500">

              By continuing you agree to the{" "}

              <Link
                href="/terms"
                className="font-medium text-orange-700 hover:underline"
              >
                Terms of Service
              </Link>

              {" "}and{" "}

              <Link
                href="/privacy"
                className="font-medium text-orange-700 hover:underline"
              >
                Privacy Policy
              </Link>

              .

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}