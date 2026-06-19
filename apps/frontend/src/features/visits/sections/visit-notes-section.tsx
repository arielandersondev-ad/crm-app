// apps/frontend/src/features/visits/sections/visit-notes-section.tsx
'use client';

import { UseFormRegister } from "react-hook-form";

interface VisitNotesSectionProps {
  register: UseFormRegister<any>;
  error?: string;
}

export function VisitNotesSection({ register, error }: VisitNotesSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">Notas Administrativas</label>
      <textarea
        {...register('notes')}
        className="w-full min-h-[100px] border rounded-md p-3"
        placeholder="Agregar notas..."
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
}