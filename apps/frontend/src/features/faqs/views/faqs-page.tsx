"use client";
import { EmptyState } from "@/shared/components/empty-state";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Plus, Settings, Sparkles } from "lucide-react";
import { useCreateFaq, useDeleteFaq, useFaqs, useUpdateFaq } from "../hooks/use-faqs";
import { LoadingState } from "@/shared/components/loading-state";
import { FaqModal } from "../components/faq-modal";
import { useState } from "react";
import { toast } from "sonner";
import { FaqTable } from "../components/faq-table";
import { Faq } from "../types/faq";
import { DeleteFaqDialog } from "../components/delete-faq.dialog";
import { BotConfigPanel } from "../components/bot-config-panel";
import { FaqSuggestionsPanel } from "../components/faq-suggestions-panel";
import { useAuthStore } from "@/stores/auth.store";
import { canAccessFaqSuggestions } from "../utils/faq-suggestions";

export function FaqsPage() {
  const { data: faqs, isLoading, error } = useFaqs();
  const createMutation = useCreateFaq();
  const updateMutation = useUpdateFaq();
  const deleteMutation = useDeleteFaq();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [deleteFaq, setDeleteFaq] = useState<Faq | null>(null);
  const userRole = useAuthStore((state) => state.user?.role);
  const showSuggestions = canAccessFaqSuggestions(userRole);

  if (isLoading) return <LoadingState />;
  if (error) {
    return <EmptyState title="Error al cargar FAQs" />;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Preguntas Frecuentes"
        description="Administra las preguntas frecuentes y la configuración del chatbot"
      />
      <Tabs defaultValue="faqs" className="mt-6">
        <TabsList className="h-auto max-w-full flex-wrap justify-start">
          <TabsTrigger value="faqs" className="py-1.5">
            Preguntas Frecuentes
          </TabsTrigger>
          <TabsTrigger value="config" className="py-1.5">
            <Settings className="size-4 mr-1" />
            Configuración
          </TabsTrigger>
          {showSuggestions && (
            <TabsTrigger value="suggestions" className="py-1.5">
              <Sparkles className="mr-1 size-4" />
              Sugerencias basadas en conversaciones
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="faqs" className="pt-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Nueva FAQ
            </Button>
          </div>
          {!faqs?.length ? (
            <EmptyState
              title="No hay preguntas frecuentes"
              description="Crea tu primera FAQ."
            />
          ) : (
            <FaqTable
              faqs={faqs}
              onEdit={(faq) => setEditingFaq(faq)}
              onDelete={(faq) => setDeleteFaq(faq)}
            />
          )}
        </TabsContent>

        <TabsContent value="config" className="pt-6">
          <BotConfigPanel />
        </TabsContent>

        {showSuggestions && (
          <TabsContent value="suggestions" className="pt-6">
            <FaqSuggestionsPanel />
          </TabsContent>
        )}
      </Tabs>

      <FaqModal
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          await createMutation.mutateAsync(data);
          toast.success("FAQ creada correctamente");
          setIsCreateOpen(false);
        }}
        loading={createMutation.isPending}
      />

      <FaqModal
        open={!!editingFaq}
        mode="edit"
        faq={editingFaq ?? undefined}
        onClose={() => setEditingFaq(null)}
        onSubmit={async (data) => {
          if (!editingFaq) return;
          await updateMutation.mutateAsync({ id: editingFaq.id, data });
          toast.success("FAQ actualizada correctamente");
          setEditingFaq(null);
        }}
        loading={updateMutation.isPending}
      />

      <DeleteFaqDialog
        open={!!deleteFaq}
        faqQuestion={deleteFaq?.question}
        onClose={() => setDeleteFaq(null)}
        onConfirm={async () => {
          if (!deleteFaq) return;
          await deleteMutation.mutateAsync(deleteFaq.id);
          toast.success("FAQ eliminada correctamente");
          setDeleteFaq(null);
        }}
      />
    </PageContainer>
  );
}
