import { useState, useCallback } from "react";

interface Props {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
}

export function useDeleteConfirmation({
  title,
  description,
  onConfirm,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  const handleConfirm = useCallback(async () => {
    try {
      await onConfirm();
      closeDialog();
    } catch (error) {
      console.error("Error during confirmation:", error);
    }
  }, [onConfirm, closeDialog]);

  return {
    isOpen,
    openDialog,
    closeDialog,
    handleConfirm,
    title,
    description,
  };
}
