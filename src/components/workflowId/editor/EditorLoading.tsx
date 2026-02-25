import { Skeleton } from "@/components/ui/skeleton";

export const EditorLoading = () => {
  return (
    <div className="flex flex-col size-full">
      <header className="flex items-center gap-2 px-4 border-b h-14 shrink-0 bg-background">
        <Skeleton className="size-7 rounded-md" />
        <div className="flex flex-row items-center justify-between w-full gap-x-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded" />
            <span className="text-muted-foreground/40">/</span>
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </header>
      <main className="relative flex-1 bg-muted/30 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--muted-foreground) / 0.15) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            <Skeleton className="h-16 w-52 rounded-xl" />
            <div className="w-px h-10 bg-border" />
            <Skeleton className="h-16 w-52 rounded-xl" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 flex flex-col gap-0.5">
          <Skeleton className="size-7 rounded-t-md rounded-b-none" />
          <Skeleton className="size-7 rounded-none" />
          <Skeleton className="size-7 rounded-none" />
          <Skeleton className="size-7 rounded-b-md rounded-t-none" />
        </div>
        <Skeleton className="absolute bottom-4 right-4 h-28 w-40 rounded-lg" />
      </main>
    </div>
  );
};
