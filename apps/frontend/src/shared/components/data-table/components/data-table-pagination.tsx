interface Props {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function DataTablePagination({ currentPage, totalPages, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded border px-3 py-1"
      >
        Anterior
      </button>

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded border px-3 py-1"
      >
        Siguiente
      </button>
    </div>
  );
}
