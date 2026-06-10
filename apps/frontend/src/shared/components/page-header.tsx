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
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex justify-between gap-4 items-center">
        <div className="flex items-center gap-3">
          {backButton && (
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="size-4" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {title}
            </h1>

            {description && (
              <p className="text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && actions}
      </div>
    </div>
  );
}