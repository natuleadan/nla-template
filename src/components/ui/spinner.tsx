import { cn } from "@/lib/config/utils";
import { IconLoader } from "@tabler/icons-react";
import { ui } from "@/lib/config/site";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconLoader
      role="status"
      aria-label={ui.spinner.ariaLabel}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
