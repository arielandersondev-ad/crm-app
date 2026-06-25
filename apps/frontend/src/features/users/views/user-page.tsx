'use client'
import { EmptyState } from "@/shared/components/empty-state";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useUsers, useCreateUser, useRemoveUser } from "../hooks/use-users";
import { LoadingState } from "@/shared/components/loading-state";
import { UserModal } from "../components/user-modal";
import { useState } from "react";
import { toast } from "sonner";
import { UsersTable } from "../components/users-table";
import { TenantUser } from "../types/user";
import { DeleteUserDialog } from "../components/delete-user-dialog";

export function UserPage() {
  const { data: users, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const removeUserMutation = useRemoveUser();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<TenantUser | null>(null);

  if (isLoading) return <LoadingState />
  if (error) {
    return (
      <EmptyState title="Error al cargar usuarios" />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Usuarios"
        description="Gestión de usuarios del tenant"
        actions={
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" />
              Agregar usuario
            </Button>
          </div>
        }
      />
      {!users?.length ? (
        <EmptyState
          title="No hay usuarios registrados"
          description="Agregue un usuario para comenzar."
        />
      ) : (
        <UsersTable
          users={users}
          onDelete={(user) => setDeleteUser(user)}
        />
      )}
      <UserModal
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          await createUserMutation.mutateAsync(data);
          toast.success('Usuario creado correctamente');
          setIsCreateOpen(false);
        }}
        loading={createUserMutation.isPending}
      />
      <DeleteUserDialog
        open={!!deleteUser}
        userName={deleteUser ? `${deleteUser.user.firstName} ${deleteUser.user.lastName}` : undefined}
        onClose={() => setDeleteUser(null)}
        onConfirm={async () => {
          if (!deleteUser) return;
          await removeUserMutation.mutateAsync(deleteUser.id);
          toast.success('Usuario eliminado correctamente');
          setDeleteUser(null);
        }}
        loading={removeUserMutation.isPending}
      />
    </PageContainer>
  );
}