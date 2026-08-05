"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { AuthEmailField } from "@/components/auth/auth-email-field";
import { AuthFormCard } from "@/components/auth/auth-form-card";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { useAuthenticationContext } from "@/providers/authentication-provider";
import {
  loginSchema,
  type LoginFormValues,
} from "@/validations/authentication-validation";

export default function LoginPage() {
  const router = useRouter();
  const { login, isSubmitting, error } = useAuthenticationContext();
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
      router.replace("/dashboard");
    }
  });

  return (
    <AuthFormCard>
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
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
            className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger-soft-foreground"
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
          <a
            href="mailto:support@streamix.dev"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Forgot password? Get help
          </a>
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