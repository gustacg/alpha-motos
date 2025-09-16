import { memo, useCallback } from "react";
import { Lead } from "@/types/lead";
import { LeadCard } from "./LeadCard";

interface LeadCardWrapperProps {
  lead: Lead;
  onDelete: (id: string) => void;
  onEdit: (lead: Lead) => void;
  onClick: () => void;
}

/**
 * Wrapper para LeadCard que isola os event handlers e previne problemas
 * de event listeners acumulativos após modal updates
 */
export const LeadCardWrapper = memo(function LeadCardWrapper({ 
  lead, 
  onDelete, 
  onEdit, 
  onClick 
}: LeadCardWrapperProps) {
  // Handlers estáveis para evitar re-renders desnecessários
  const handleEdit = useCallback(() => {
    onEdit(lead);
  }, [onEdit, lead]);

  const handleDelete = useCallback(() => {
    onDelete(lead.id);
  }, [onDelete, lead.id]);

  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <LeadCard
      lead={lead}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onClick={handleClick}
    />
  );
});
