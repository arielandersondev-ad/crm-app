import { ActionButton, ColumnConfig } from "@/shared/components/data-table/types";
import { Visit } from "../types/visit";
import { DynamicTable } from "@/shared/components/data-table/dynamic-table";
import { formatDateTime, toDateTimeLocal } from "@/constants/format";

interface VisitTableProps {
  visits: Visit[];
  onEdit?: (visit: Visit) => void;
  onDelete?: (visit: Visit) => void;
}

export function VisitTables({ visits, onEdit, onDelete }: VisitTableProps) {
  const columns: ColumnConfig<Visit>[] = [
    {
      key: 'status',
      label: "Estado",
      searchable: true,
      sortable: true,
    },
    {
      key: 'user.firstName',
      label: 'Encargado',
      searchable: true,
      sortable: true,
    },
    {
      key: 'client.fullName',
      label: 'Paciente',
      searchable: true,
      sortable: true,
    },
    {
      key: 'startedAt',
      label: 'Inicio',
      searchable: true,
      sortable: true,
      render: (value: string) => formatDateTime(value),
    },
    {
      key: 'completedAt',
      label: 'Fin',
      searchable: true,
      sortable: true,
      render: (value: string) => formatDateTime(value),
    },
    {
      key: 'notes',
      label: 'Notas',
      searchable: true,
      sortable: true,
    },
  ];
  const actions: ActionButton<Visit>[] = [
    {
      label: "Editar",
      onClick: (visit: Visit) => {
        onEdit?.(visit);
      },
    },
    {
      label: "Eliminar",
      onClick: (visit: Visit) => {
        onDelete?.(visit);
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