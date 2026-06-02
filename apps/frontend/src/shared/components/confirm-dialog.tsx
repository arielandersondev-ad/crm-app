"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;

  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>

          {description && (
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}