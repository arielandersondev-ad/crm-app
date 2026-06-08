"use client";

import { useState } from "react";
import { SearchModal } from "./search-modal";
import { SearchableItem } from "./types";

interface EntitySelectorProps<T extends SearchableItem> {
  label: string;

  items: T[];

  value?: T;

  placeholder?: string;

  onSelect: (item: T) => void;
}

export function EntitySelector<T extends SearchableItem>({
  label,
  items,
  value,
  placeholder = "Seleccionar",
  onSelect,
}: EntitySelectorProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <label className="block mb-1">
          {label}
        </label>

        <div className="flex gap-2">
          <input
            readOnly
            value={value?.label ?? ""}
            placeholder={placeholder}
            className="w-full border rounded-md p-2"
          />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="border rounded-md px-4"
          >
            Buscar
          </button>
        </div>
      </div>

      <SearchModal
        title={label}
        open={open}
        items={items}
        onClose={() => setOpen(false)}
        onSelect={onSelect}
      />
    </>
  );
}