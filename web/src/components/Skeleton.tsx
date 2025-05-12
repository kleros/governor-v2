import { cn } from "@/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-base bg-klerosUIComponentsMediumBlue", className)} {...props} />;
}

export { Skeleton };
