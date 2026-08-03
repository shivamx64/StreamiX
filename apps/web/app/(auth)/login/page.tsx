"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { AuthEmailField } from "@/components/auth/auth-email-field";
import { AuthFormCard } from "@/components/auth/auth-form-card";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { useAuthentication } from "@/hooks/use-authentication";
import {
  loginSchema,
  type LoginFormValues,
} from "@/validations/authentication-validation";

export default function LoginPage() {
  const router = useRouter();
  const { login, isSubmitting, error } = useAuthentication();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const success = await login(values);

    if (success) {
      router.replace("/");
    }
  });

  return (
    <AuthFormCard>
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Log in to your StreamiX account to continue.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        <AuthEmailField
          id="email"
          error={errors.email?.message}
          inputProps={register("email")}
        />

        <AuthPasswordField
          id="password"
          error={errors.password?.message}
          inputProps={register("password")}
        />

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary transition hover:text-primary/80"
          >
            Forgot password?
          </Link>
        </div>

        <AuthSubmitButton loading={isSubmitting}>
          Log in
        </AuthSubmitButton>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary transition hover:text-primary/80"
        >
          Sign up free
        </Link>
      </p>
    </AuthFormCard>
  );
}