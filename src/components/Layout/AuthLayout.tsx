import Link from "next/link";
import Image from "next/image";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-semibold text-xl"
        >
          <Image
            src="/logos/logo.svg"
            alt="Nexus"
            width={28}
            height={28}
            className="dark:invert pb-1.5"
          />
          <span>Nexus</span>
        </Link>
        {children}
      </div>
    </div>
  );
};
