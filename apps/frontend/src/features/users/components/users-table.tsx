'use client';
import { DynamicTable } from "@/shared/components/data-table/dynamic-table";
import type { TenantUser } from "../types/user";
import type { ActionButton, ColumnConfig } from "@/shared/components/data-table/types";

interface UsersTableProps {
  users: TenantUser[];
  onEdit?: (user: TenantUser) => void;
  onActivete?: (user: TenantUser) => void;
  onDeactivete?: (user: TenantUser) => void;
  onDelete?: (user: TenantUser) => void;
}

export function UsersTable({ users, onEdit, onActivete, onDeactivete, onDelete }: UsersTableProps) {
  const columns: ColumnConfig<TenantUser>[] = [
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
      key: 'isActive' as any,
      label: 'Estado',
      render: (value, row)=>{
        return value ? 'Activo' : 'Inactivo'
      }
    },
    {
      key: 'role' as any,
      label: 'Rol',
    },
    {
      key: 'sucursal' as any,
      label: 'Sucursal',
    },
  ];

  const actions: ActionButton<TenantUser>[] = [
    {
      label: "Editar",
      onClick: (user: TenantUser) => onEdit?.(user),
    },
    {
      label: "Activar Usuario",
      show: (user) => !user.isActive,
      onClick: (user: TenantUser) => onActivete?.(user),
    },
    {
      label: "Desactivar Usuario",
      show: (user) => user.isActive,
      onClick: (user: TenantUser) => onDeactivete?.(user),
    },
    {
      label: "Eliminar",
      show: (user) => !user.isActive,
      onClick: (user: TenantUser) => onDelete?.(user),
      variant: "danger"
    },
  ];

  return (
    <DynamicTable
      data={users}
      columns={columns}
      actions={actions}
      showToolbar={true}
      showPagination={true}
      pageSize={10}
      stickyHeader={true}
    />
  );
}
