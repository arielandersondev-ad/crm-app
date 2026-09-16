import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-w-0 max-w-full space-y-6">
      {children}
    </div>
  );
}
