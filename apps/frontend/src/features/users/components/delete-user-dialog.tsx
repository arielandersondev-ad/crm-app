import { Modal } from "@/shared/components/modal";

interface DeleteUserDialogProps {
  open: boolean;
  loading?: boolean;
  userName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserDialog({ open, loading, userName, onClose, onConfirm }: DeleteUserDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Eliminar usuario"
      description="Esta acción no se puede deshacer."
    >
      <div className="space-y-6">
        <p>
          ¿Desea eliminar al usuario <strong>{userName}</strong> del tenant?
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground"
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}
