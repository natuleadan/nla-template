import { cn } from "@/lib/config/utils";
import type { ReactNode } from "react";

function TypographyH1({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      className={cn("scroll-m-20 text-3xl font-bold tracking-tight", className)}
      {...props}
    />
  );
}

function TypographyH2({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function TypographyH3({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={cn(
        "scroll-m-18 text-lg font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function TypographyH4({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h4">) {
  return (
    <h4
      className={cn("scroll-m-18 text-base font-medium", className)}
      {...props}
    />
  );
}

function TypographyP({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  );
}

function TypographyBlockquote({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className={cn(
        "mt-4 rounded-lg bg-muted/50 px-4 py-3 italic text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TypographyInlineCode({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TypographyLead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("text-base text-muted-foreground", className)}
      {...props}
    />
  );
}

function TypographyLarge({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("text-base font-semibold", className)} {...props} />
  );
}

function TypographySmall({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"small">) {
  return (
    <small
      className={cn("text-xs font-medium leading-none", className)}
      {...props}
    />
  );
}

function TypographyMuted({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

function TypographyList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      className={cn(
        "my-4 ml-6 list-disc space-y-1 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TypographyTable({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border">
      <table
        className={cn("w-full text-sm caption-bottom", className)}
        {...props}
      />
    </div>
  );
}

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyBlockquote,
  TypographyInlineCode,
  TypographyLead,
  TypographyLarge,
  TypographySmall,
  TypographyMuted,
  TypographyList,
  TypographyTable,
};
