"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SearchableItem } from "./types";

interface SearchModalProps<T extends SearchableItem> {
  title: string;
  open: boolean;
  items: T[];
  onClose: () => void;
  onSelect: (item: T) => void;
}

export function SearchModal<T extends SearchableItem>({
  title,
  open,
  items,
  onClose,
  onSelect,
}: SearchModalProps<T>) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase();

    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
    );
  }, [items, search]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader className="shrink-0 pr-8">
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="w-full shrink-0 border rounded-md p-2"
        />

        <div className="min-h-0 max-h-80 overflow-y-auto overscroll-contain space-y-2">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full border rounded-md p-3 text-left hover:bg-muted"
              onClick={() => {
                onSelect(item);
                onClose();
              }}
            >
              <div className="font-medium">
                {item.label}
              </div>

              {item.description && (
                <div className={ item.description==='inactivo'?`text-sm text-destructive`:`text-sm text-success`}>
                  {item.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

//uso
{/* <EntitySelector
  label="Servicio"
  items={services}
  value={selectedService}
  onSelect={(service) => {
    setSelectedService(service);

    setValue(
      "serviceId",
      service.id
    );
  }}
/> */}
