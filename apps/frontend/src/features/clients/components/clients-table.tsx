'use client';
import { DynamicTable } from "@/shared/components/data-table/dynamic-table";
import type { Client } from "../types/client";
import { ActionButton, ColumnConfig } from "@/shared/components/data-table/types";

interface ClientsTableProps {
  clients: Client[];
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onVisit?: (client: Client) => void;
}

export function ClientsTable({ clients, onEdit, onDelete, onVisit }: ClientsTableProps) {
  const columns: ColumnConfig<Client>[] = [
    {
      key: 'fullName',
      label: 'Nombre',
      searchable: true,
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      searchable: true,
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Teléfono',
      searchable: true,
      render: (value) => value ?? '-',
    },
  ];
  const actions: ActionButton<Client>[] = [
  {
    label: "Editar",
    onClick: (client: Client) => {
      onEdit?.(client);
    },
  },
  {
    label: "Eliminar",
    onClick: (client: Client) => {
      onDelete?.(client);
    },
    variant: "danger",
  },
  {
    label: "Consulta",
    onClick: (client: Client) => {
      onVisit?.(client);
    },
    variant: "primary",
  },
  {
    label: "Detalles",
    onClick: (client: Client) => {
    },
    variant: "neutral",
  },
];
  return (
    <DynamicTable
      data={clients}
      columns={columns}
      actions={actions}
      showToolbar={true}
      showPagination={true}
      pageSize={10}
      stickyHeader={true}
    />
  );
}