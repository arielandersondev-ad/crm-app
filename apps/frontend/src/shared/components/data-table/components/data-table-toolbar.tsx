import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../../ui/dropdown-menu";

interface Props {
  searchTerm: string;

  onSearch: (value: string) => void;

  columns?: {
    key: string;
    label: string;
  }[];

  visibleColumns?: string[];

  onToggleColumn?: (
    key: string
  ) => void;
}

export function DataTableToolbar({ searchTerm, onSearch, columns, visibleColumns, onToggleColumn }: Props) {
  return (
    <div
      className="
        border-b
        bg-background
        p-4
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div />

        <div className="relative w-full lg:max-w-xs flex items-center gap-2">
          <input
            value={searchTerm}
            onChange={(e) =>
              onSearch(e.target.value)
            }
            placeholder="Buscar..."
            className="
              w-full
              rounded-lg
              border
              px-4
              py-2
            "
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columnas
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {columns?.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns?.includes(
                    column.key
                  )}
                  onCheckedChange={() =>
                    onToggleColumn?.(
                      column.key
                    )
                  }
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}