import { AuthLayout } from "@/components/Layout/AuthLayout";
import { requireUnAuth } from "@/lib/auth/auth-utils";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnAuth();
  return <AuthLayout>{children}</AuthLayout>;
}
