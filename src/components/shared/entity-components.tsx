import Link from "next/link";
import type { ReactNode, MouseEvent } from "react";
import {
  AlertTriangleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  title,
  description,
  onNew,
  newButtonHref,
  newButtonLabel,
  disabled,
  isCreating,
}: EntityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button
          disabled={isCreating || disabled}
          onClick={onNew}
          className="rounded-lg shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:brightness-110 active:scale-[0.97]"
        >
          <span className="inline-flex items-center gap-2">
            {isCreating ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            <span className="leading-none">{newButtonLabel}</span>
          </span>
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button
          asChild
          className="rounded-lg shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:brightness-110 active:scale-[0.97]"
        >
          <Link href={newButtonHref}>
            <span className="inline-flex items-center gap-2">
              <PlusIcon className="size-4" />
              <span className="leading-none">{newButtonLabel}</span>
            </span>
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntityContainerProps = {
  children: ReactNode;
  header?: ReactNode;
  search?: ReactNode;
  pagination?: ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="h-full p-4 md:px-10 md:py-6">
      <div className="flex flex-col w-full h-full max-w-7xl mx-auto gap-y-6">
        {header}
        <div className="flex flex-col h-full gap-y-4">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) => {
  return (
    <div className="relative w-full max-w-sm ml-auto">
      <SearchIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
      <Input
        className="w-full h-10 rounded-xl bg-muted/40 backdrop-blur-sm shadow-none border-border/50 pl-10 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/20 focus-visible:ring-2 focus-visible:border-primary/30 transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex items-center justify-between w-full py-2">
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages || 1}</span>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          disabled={page === 1 || disabled}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="rounded-lg transition-all duration-200 hover:shadow-sm"
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0 || disabled}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="rounded-lg transition-all duration-200 hover:shadow-sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

interface StateViewProps {
  message?: string;
}

export const LoadingView = ({ message }: StateViewProps) => {
  return (
    <div className="flex flex-col gap-y-3 flex-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4"
        >
          <Skeleton className="size-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="size-8 rounded-lg shrink-0" />
        </div>
      ))}
      {!!message && (
        <p className="text-sm text-center text-muted-foreground pt-2">
          {message}
        </p>
      )}
    </div>
  );
};

interface ErrorViewProps extends StateViewProps {
  onRetry?: () => void;
}

export const ErrorView = ({ message, onRetry }: ErrorViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full">
      <div className="flex flex-col items-center gap-y-5 px-10 py-8 rounded-2xl border border-destructive/15 bg-linear-to-b from-destructive/4 to-transparent backdrop-blur-sm max-w-sm w-full text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute size-16 rounded-full bg-destructive/10 animate-ping animation-duration-[3s]" />
          <div className="relative flex items-center justify-center size-14 rounded-full bg-destructive/10 ring-1 ring-destructive/20">
            <AlertTriangleIcon className="size-6 text-destructive" />
          </div>
        </div>

        <div className="flex flex-col gap-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">
            Something went wrong
          </h3>
          {!!message && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
          )}
        </div>

        {!!onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="rounded-lg border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className="border border-dashed border-border/60 bg-muted/20 backdrop-blur-sm rounded-xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>No Items</EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onNew && (
        <EmptyContent>
          <Button
            onClick={onNew}
            className="gap-1.5 transition-all duration-200 hover:shadow-md active:scale-[0.97]"
          >
            <PlusIcon className="size-4" />
            Add Item
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="max-w-sm mx-auto w-full">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-3", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: ReactNode;
  image?: ReactNode;
  actions?: ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProps) => {
  const handleRemove = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) return;

    if (onRemove) await onRemove();
  };

  return (
    <Link href={href} prefetch>
      <div
        className={cn(
          "group relative flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-4",
          "shadow-sm hover:shadow-md hover:-translate-y-px",
          "transition-all duration-200 ease-out",
          isRemoving && "opacity-50 pointer-events-none",
          className,
        )}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {image}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-200">
              {title}
            </p>
            {!!subtitle && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {(actions || onRemove) && (
          <div className="flex items-center gap-x-2 shrink-0">
            {actions}
            {onRemove && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                    className="size-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem
                    onClick={handleRemove}
                    className="text-destructive focus:text-destructive"
                  >
                    <span className="inline-flex items-center gap-2">
                      <TrashIcon className="size-4 text-destructive pb-0.75" />
                      <span className="leading-none pt-0.5">Delete</span>
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};
