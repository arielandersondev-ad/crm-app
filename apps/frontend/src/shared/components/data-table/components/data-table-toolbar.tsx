interface Props {
  searchTerm: string;

  onSearch: (value: string) => void;
}

export function DataTableToolbar({ searchTerm, onSearch }: Props) {
  return (
    <div
      className="
        border-b
        bg-white
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

        <div className="relative w-full lg:max-w-xs">
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
        </div>
      </div>
    </div>
  );
}