import { DynamicTable } from "@/shared/components/data-table/dynamic-table";
import { Faq } from "../types/faq";
import { ActionButton, ColumnConfig } from "@/shared/components/data-table/types";

const CATEGORY_LABELS: Record<string, string> = {
  GENERAL: "General",
  HORARIOS: "Horarios",
  SERVICIOS: "Servicios",
  PRECIOS: "Precios",
  CONTACTO: "Contacto",
  EMERGENCIAS: "Emergencias",
  CITAS: "Citas",
};

interface FaqTableProps {
  faqs: Faq[];
  onEdit: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
}

export function FaqTable({ faqs, onEdit, onDelete }: FaqTableProps) {
  const columns: ColumnConfig<Faq>[] = [
    {
      key: "question",
      label: "Pregunta",
      searchable: true,
      sortable: true,
      render: (value: string) => (
        <span className="line-clamp-2 max-w-xs">{value}</span>
      ),
    },
    {
      key: "answer",
      label: "Respuesta",
      searchable: true,
      render: (value: string) => (
        <span className="line-clamp-2 max-w-md">{value}</span>
      ),
    },
    {
      key: "category",
      label: "Categoría",
      searchable: true,
      sortable: true,
      render: (value: string) => CATEGORY_LABELS[value] ?? value,
    },
  ];

  const actions: ActionButton<Faq>[] = [
    {
      label: "Editar",
      onClick: (faq) => onEdit(faq),
    },
    {
      label: "Eliminar",
      onClick: (faq) => onDelete(faq),
      variant: "danger",
    },
  ];

  return (
    <DynamicTable
      data={faqs}
      columns={columns}
      actions={actions}
      showToolbar
      showPagination
      pageSize={10}
      stickyHeader
    />
  );
}
