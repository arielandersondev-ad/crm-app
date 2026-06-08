import { ActionButton, ColumnConfig } from "@/shared/components/data-table/types";
import { Visit } from "../types/visit";
import { DynamicTable } from "@/shared/components/data-table/dynamic-table";

interface VisitTableProps {
  visits: Visit[];
  onEdit?: (visit: Visit) => void;
  onDelete?: (visit: Visit) => void;
}

export function VisitTables({ visits, onEdit, onDelete }: VisitTableProps) {
  const columns: ColumnConfig<Visit>[] = [
    {
      key: 'name',
      label: "Nombre",
      searchable: true,
      sortable: true,
    },
    {
      key: 'userId',
      label: 'ID de usuario',
      searchable: true,
      sortable: true,
    },
  ];
  const actions: ActionButton<Visit>[] = [
    {
      label: "Editar",
      onClick: (visit: Visit) => {
        onEdit?.(visit);
        console.log("editar", visit);
      },
    },
    {
      label: "Eliminar",
      onClick: (visit: Visit) => {
        onDelete?.(visit);
        console.log("eliminar", visit);
      },
    },
  ];
  return (
    <DynamicTable
      data={visits}
      columns={columns}
      actions={actions}
      pageSize={10}
      stickyHeader={true}
      showToolbar={true}
    />
  )
}