'use client';
import { DynamicTable } from "@/shared/components/data-table/dynamic-table";
import type { Client } from "../types/client";
import { ActionButton, ColumnConfig } from "@/shared/components/data-table/types";
import { useState } from "react";
import { ClientModal } from "./cliente-modal";

interface ClientsTableProps {
  clients: Client[];
  onEdit?: (client: Client) => void;
}

export function ClientsTable({ clients, onEdit }: ClientsTableProps) {
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
      console.log("editar", client);
    },
  },
  {
    label: "Eliminar",
    onClick: (client: Client) => {
      console.log("eliminar", client);
    },
    variant: "danger",
  },
];
  return (
    <>
      <DynamicTable
        data={clients}
        columns={columns}
        actions={actions}
        showToolbar
        showPagination
        pageSize={10}
        stickyHeader
      />
    </>
  );
}