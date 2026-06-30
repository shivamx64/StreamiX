"use client";

import { useState } from "react";
import Link from "next/link";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Eye,
  EyeOff,
  Globe,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name is too long."),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Must contain one uppercase letter.")
      .regex(/[a-z]/, "Must contain one lowercase letter.")
      .regex(/[0-9]/, "Must contain one number."),

    confirmPassword: z.string(),

    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the Terms & Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    console.log(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* Name */}
      <div className="space-y-1">
        <Input
          placeholder="Full name"
          autoComplete="name"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-xs text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-xs text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            className="pr-10"
            {...register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={
              showConfirmPassword ? "text" : "password"
            }
            placeholder="Confirm password"
            autoComplete="new-password"
            className="pr-10"
            {...register("confirmPassword")}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((v) => !v)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 text-xs text-stone-600">
        <input
          type="checkbox"
          className="mt-0.5"
          {...register("acceptTerms")}
        />

        <span>
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-orange-700 hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-orange-700 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {errors.acceptTerms && (
        <p className="text-xs text-red-600">
          {errors.acceptTerms.message}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs text-stone-400">OR</span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
      >
        <Globe className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>

      {/* Footer */}
      <p className="text-center text-xs text-stone-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-orange-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}