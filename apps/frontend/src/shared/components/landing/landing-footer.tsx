import { Eye } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="size-4 text-primary" />
          <span>Oftalmológica K &amp; Y</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
