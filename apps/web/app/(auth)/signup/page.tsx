"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { AuthEmailField } from "@/components/auth/auth-email-field";
import { AuthFormCard } from "@/components/auth/auth-form-card";
import { AuthNameField } from "@/components/auth/auth-name-field";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { useAuthenticationContext } from "@/providers/authentication-provider";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/validations/authentication-validation";

export default function SignupPage() {
  const router = useRouter();
  const { register: registerAccount, isSubmitting, error } =
    useAuthenticationContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const success = await registerAccount({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (success) {
      router.replace("/dashboard");
    }
  });

  return (
    <AuthFormCard>
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start uploading and streaming in minutes. Free forever.
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

        <AuthNameField
          id="name"
          error={errors.name?.message}
          inputProps={register("name")}
        />

        <AuthEmailField
          id="email"
          error={errors.email?.message}
          inputProps={register("email")}
        />

        <AuthPasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          error={errors.password?.message}
          inputProps={register("password")}
        />

        <AuthPasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          inputProps={register("confirmPassword")}
        />

        <p className="text-xs leading-5 text-muted-foreground">
          By creating an account, you agree to StreamiX&apos;s Terms and Privacy
          Policy.
        </p>

        <AuthSubmitButton loading={isSubmitting}>
          Create account
        </AuthSubmitButton>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary transition hover:text-primary/80"
        >
          Log in
        </Link>
      </p>
    </AuthFormCard>
  );
}