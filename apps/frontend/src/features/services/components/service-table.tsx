import { DynamicTable } from "@/shared/components/data-table/dynamic-table";
import { Service } from "../types/service";
import { ActionButton, ColumnConfig } from "@/shared/components/data-table/types";

interface ServiceTableProps {
  services: Service[];
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
}
export function ServiceTable({ services, onDelete, onEdit }: ServiceTableProps) {

  const columns: ColumnConfig<Service>[] = [
    {
      key: 'name',
      label: "Nombre",
      searchable: true,
      sortable: true,
    },
    {
      key: 'description',
      label: 'Descripcion',
      searchable: true,
      sortable: true,
    },
    {
      key: 'basePrice',
      label: "Precio",
      searchable: true,
      sortable: true,
    },
  ];
  const actions: ActionButton<Service>[] = [
    {
      label: "Editar",
      onClick: (service: Service) => {
        onEdit?.(service);
        console.log("editar", service);
      },
    },
    {
      label: "Eliminar",
      onClick: (service: Service) => {
        onDelete?.(service);
        console.log("eliminar", service);
      },
      variant: "danger",
    },
  ];
  return (
    <DynamicTable
      data={services}
      columns={columns}
      actions={actions}
      showToolbar={true}
      showPagination={true}
      pageSize={10}
      stickyHeader={true}
    />
  );
}
