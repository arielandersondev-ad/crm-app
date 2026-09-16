"use client";

import { useMemo, useState } from "react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg bg-background p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="w-full border rounded-md p-2 mb-4"
        />

        <div className="max-h-80 overflow-y-auto space-y-2">
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
      </div>
    </div>
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
