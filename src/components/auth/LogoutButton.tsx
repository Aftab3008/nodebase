"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/auth/signin");
            },
          },
        })
      }
    >
      Logout
    </Button>
  );
}
