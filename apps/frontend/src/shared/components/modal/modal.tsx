import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;

  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({
  size = 'md',
  open,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  const sizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  "2xl": "sm:max-w-6xl",
};
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className={sizes[size]}>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}