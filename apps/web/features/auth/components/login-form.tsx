"use client";

import { useState } from "react";
import Link from "next/link";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff, Loader2, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    console.log(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md space-y-4"
    >
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-stone-900">
          Sign in to StreamiX
        </h1>
        <p className="text-xs text-stone-500">
          Secure access to your video workspace
        </p>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Input
          id="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            id="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            className="pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Row actions */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-stone-600">
          <input type="checkbox" {...register("rememberMe")} />
          Remember
        </label>

        <Link href="/forgot-password" className="text-orange-700">
          Forgot?
        </Link>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-stone-400">
        <div className="h-px flex-1 bg-stone-200" />
        OR
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      {/* OAuth (compact) */}
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" className="h-9 text-xs">
          <Globe className="mr-2 h-4 w-4" />
          Google
        </Button>

        <Button type="button" variant="outline" className="h-9 text-xs">
          GitHub
        </Button>
      </div>

      {/* Minimal note */}
      <p className="text-center text-[11px] text-stone-400">
        Secure JWT auth via Supabase
      </p>

      {/* Footer */}
      <div className="text-center text-xs text-stone-500">
        New here?{" "}
        <Link href="/register" className="text-orange-700">
          Create account
        </Link>
      </div>
    </form>
  );
}