'use client'
import { EmptyState } from "@/shared/components/empty-state";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useUsers, useCreateUser, useRemoveUser, useUpdateUserRole, useActivateUser, useDeactivateUser } from "../hooks/use-users";
import { LoadingState } from "@/shared/components/loading-state";
import { UserModal } from "../components/user-modal";
import { useState } from "react";
import { toast } from "sonner";
import { UsersTable } from "../components/users-table";
import { TenantUser } from "../types/user";
import { DeleteUserDialog } from "../components/delete-user-dialog";
import { ChangePasswordModal } from "../components/change-password-modal";

export function UsersPage() {
  const { data: users, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserRolSucursalMutation = useUpdateUserRole();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();
  const removeUserMutation = useRemoveUser();

  const [selectdUser, setSelectedUser] = useState<any>() 

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<TenantUser | null | any>(null);

  if (isLoading) return <LoadingState />
  if (error) {
    return (
      <EmptyState title="Error al cargar usuarios" />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Personal"
        description="Gestión del personal de la clínica"
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
          onEdit={(user)=>{
            setIsEditOpen(true)
            setSelectedUser(user)
          }}
          onActivete={async(user)=>{
            await activateUserMutation.mutateAsync(user.id);
            toast.success('Usuario Activado');
          }}
          onDeactivete={async(user)=>{
            await deactivateUserMutation.mutateAsync(user.id);
            toast.success('Usuario Desactivado');
          }}
          onDelete={(user) => {setDeleteUser(user);console.log("user a ser eliminado: ",user)}}
        />
      )}
      <UserModal
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          const { id, sucursalId, ...payload } = data;
          await createUserMutation.mutateAsync(payload);
          toast.success('Usuario creado correctamente');
          setIsCreateOpen(false);
        }}
        loading={createUserMutation.isPending}
      />
      <UserModal
        open={isEditOpen}
        mode="edit"
        user={selectdUser}
        onClose={() => setIsEditOpen(false)}
        onSubmit={async (data) => {
          console.log("data send: ",data)
          await updateUserRolSucursalMutation.mutateAsync(data);
          toast.success('Usuario Actualizado Correctamente');
          setIsCreateOpen(false);
        }}
        loading={createUserMutation.isPending}
        onOpenChangePassword={() => {
          setIsEditOpen(false);
          setIsPasswordOpen(true);
        }}
      />
      <ChangePasswordModal
        open={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />
      <DeleteUserDialog
        open={!!deleteUser}
        userName={deleteUser ? `${deleteUser.fullName}` : undefined}
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
