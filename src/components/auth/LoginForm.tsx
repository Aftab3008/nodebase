"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { LoginSchema, LoginSchemaType } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });
  const isPending = form.formState.isSubmitting;

  const signInGithub = async () => {
    await authClient.signIn.social(
      { provider: "github" },
      {
        onSuccess: () => router.push("/"),
        onError: () => {
          toast.error("Something went wrong");
        },
      },
    );
  };

  const signInGoogle = async () => {
    await authClient.signIn.social(
      { provider: "google" },
      {
        onSuccess: () => router.push("/"),
        onError: () => {
          toast.error("Something went wrong");
        },
      },
    );
  };

  const onSubmit = async (values: LoginSchemaType) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
        onError: (context) => {
          toast.error(context.error?.message ?? "Something went wrong");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={signInGithub}
                  disabled={isPending}
                >
                  <Image
                    src="/logos/github.svg"
                    alt="GitHub"
                    width={20}
                    height={20}
                  />
                  Continue with Github
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={signInGoogle}
                  disabled={isPending}
                >
                  <Image
                    src="/logos/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  Continue with Google
                </Button>
              </div>
              <div className="grid gap-6">
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="password"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin flex items-center justify-center" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              <div className="text-sm text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="underline underline-offset-4 text-primary"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
