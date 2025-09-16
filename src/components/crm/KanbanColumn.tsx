import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead, LeadStatus } from "@/types/lead";
import { LeadCardWrapper } from "./LeadCardWrapper";
import { LeadDetailsModal } from "./LeadDetailsModal";
import { EditLeadDialog } from "./EditLeadDialog";
import { useDroppable } from "@dnd-kit/core";
import { useState, useCallback, useRef, useEffect } from "react";
import { useBodyPointerEvents } from "@/hooks/useBodyPointerEvents";

interface KanbanColumnProps {
  status: LeadStatus;
  title: string;
  leads: Lead[];
  count: number;
  onDeleteLead: (id: string) => void;
  onUpdateLead: (id: string, leadData: Partial<Lead>) => void;
}

const statusColors: Record<LeadStatus, string> = {
  lead: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  qualificado: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  consultar: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  agendamento: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  nao_comparecimento: 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
  contrato: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  cliente: 'bg-green-500/10 text-green-700 dark:text-green-300',
  distrato: 'bg-red-500/10 text-red-700 dark:text-red-300',
  curioso: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
  descartado: 'bg-slate-500/10 text-slate-700 dark:text-slate-300'
};

export function KanbanColumn({ status, title, leads, count, onDeleteLead, onUpdateLead }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Hook para gerenciar pointer-events do body
  const { ensureBodyInteractive, cleanupBodyStyle } = useBodyPointerEvents();
  
  // Usar ref para evitar problemas de stale closure
  const cleanupTimeoutRef = useRef<NodeJS.Timeout>();
  const isCleaningUpRef = useRef(false);

  // Cleanup automático quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      isCleaningUpRef.current = true;
    };
  }, []);

  const handleLeadClick = useCallback((lead: Lead) => {
    if (isCleaningUpRef.current) return;
    setSelectedLead(lead);
    setIsModalOpen(true);
  }, []);

  const handleLeadEdit = useCallback((lead: Lead) => {
    if (isCleaningUpRef.current) return;
    setEditingLead(lead);
    setIsEditModalOpen(true);
  }, []);

  const handleSafeUpdateLead = useCallback(async (id: string, leadData: Partial<Lead>) => {
    try {
      console.log('🔄 Iniciando atualização segura do lead...');
      await onUpdateLead(id, leadData);
      
      // SOLUÇÃO CRÍTICA: Garantir que body está interativo após atualização
      setTimeout(() => {
        ensureBodyInteractive();
        console.log('✅ Lead atualizado - body interativo garantido');
      }, 50);
      
      // Aguardar um tick antes de limpar o estado para evitar race conditions
      cleanupTimeoutRef.current = setTimeout(() => {
        if (!isCleaningUpRef.current) {
          setIsEditModalOpen(false);
          setEditingLead(null);
          // Dupla verificação de segurança
          ensureBodyInteractive();
        }
      }, 100);
      
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      // Em caso de erro, ainda garantir que body está interativo
      ensureBodyInteractive();
    }
  }, [onUpdateLead, ensureBodyInteractive]);

  const handleCloseEditModal = useCallback(() => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }
    
    // SOLUÇÃO CRÍTICA: Limpar body style antes de fechar modal
    cleanupBodyStyle();
    
    // Forçar cleanup imediato
    setIsEditModalOpen(false);
    setEditingLead(null);
    isCleaningUpRef.current = false;

    // Garantir que body está interativo após fechar
    setTimeout(() => {
      ensureBodyInteractive();
    }, 100);
  }, [cleanupBodyStyle, ensureBodyInteractive]);

  const calculateHeight = () => {
    if (leads.length === 0) return 'min-h-[300px]';
    return '';
  };

  return (
    <>
      <div className="flex-shrink-0 w-80 min-w-[20rem]">
        <Card className="flex flex-col">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="flex items-center justify-between text-base">
              <span>{title}</span>
              <Badge variant="secondary" className={statusColors[status]}>
                {count}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div
              ref={setNodeRef}
              className={`flex-1 space-y-3 pr-2 ${calculateHeight()}`}
            >
              {leads.map((lead) => (
                <LeadCardWrapper
                  key={`${lead.id}-${lead.updated_at || lead.created_at}`}
                  lead={lead}
                  onDelete={onDeleteLead}
                  onEdit={handleLeadEdit}
                  onClick={() => handleLeadClick(lead)}
                />
              ))}
              {leads.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Nenhum lead neste status
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <LeadDetailsModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
      />

      <EditLeadDialog
        lead={editingLead}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdateLead={handleSafeUpdateLead}
      />
    </>
  );
}