import type { Client } from "../types/client";

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({
  clients,
}: ClientsTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="p-3 text-left">
            Nombre
          </th>

          <th className="p-3 text-left">
            Email
          </th>

          <th className="p-3 text-left">
            Teléfono
          </th>
        </tr>
      </thead>

      <tbody>
        {clients.map((client) => (
          <tr
            key={client.id}
            className="border-b"
          >
            <td className="p-3">
              {client.fullName}
            </td>

            <td className="p-3">
              {client.email}
            </td>

            <td className="p-3">
              {client.phone ?? "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}