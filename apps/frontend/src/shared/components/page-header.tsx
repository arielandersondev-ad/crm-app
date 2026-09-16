import { ReactNode } from "react";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backButton?: boolean;
}

export function PageHeader({ title, description, actions, backButton }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6 min-w-0">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-2 sm:items-center sm:gap-3">
          {backButton && (
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="size-4" />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>

            {description && (
              <p className="mt-1 break-words text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
