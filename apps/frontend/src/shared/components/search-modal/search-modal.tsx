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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-4">
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
              className="w-full border rounded-md p-3 text-left hover:bg-gray-100"
              onClick={() => {
                onSelect(item);
                onClose();
              }}
            >
              <div className="font-medium">
                {item.label}
              </div>

              {item.description && (
                <div className="text-sm text-gray-500">
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