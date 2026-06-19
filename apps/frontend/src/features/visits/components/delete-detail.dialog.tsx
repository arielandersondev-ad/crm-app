import { Modal } from "@/shared/components/modal";

interface DeleteServiceDialogProps {
  open: boolean;
  loading?: boolean;
  detailName?: string;

  onClose: () => void;
  onConfirm: () => void;
}


export function DeleteDetailDialog({ open, loading, detailName, onClose, onConfirm }: DeleteServiceDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Eliminar Servicio"
      description="Esta acción no se puede deshacer."
    >
      <div className="space-y-6">
        <p>
          ¿Desea eliminar el servicio{" "}
          <strong>{detailName}</strong>?
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