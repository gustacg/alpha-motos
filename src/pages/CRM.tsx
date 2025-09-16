import { usePageTitle } from "@/hooks/usePageTitle";
import { useLeads } from "@/hooks/useLeads";
import { LeadFilters } from "@/components/crm/LeadFilters";
import { LeadKanban } from "@/components/crm/LeadKanban";
import { AddLeadDialog } from "@/components/crm/AddLeadDialog";
import { Card, CardContent } from "@/components/ui/card";

export default function CRM() {
  usePageTitle("Clientes");
  
  const {
    leadsByStatus,
    filters,
    updateFilters,
    loading,
    moveLead,
    deleteLead,
    addLead,
    updateLead
  } = useLeads();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Carregando leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full min-w-0 overflow-hidden page-container">
      {/* Header com filtros e botão adicionar - Responsivo */}
      <div className="flex flex-col gap-4">
        <LeadFilters
          filters={filters}
          onFiltersChange={updateFilters}
          addLeadButton={<AddLeadDialog onAddLead={addLead} />}
        />
        
        {/* Botão adicionar - separado no mobile (3ª linha conforme solicitado) */}
        <div className="flex md:hidden w-full">
          <AddLeadDialog onAddLead={addLead} />
        </div>
      </div>

      {/* Kanban - Container com scroll horizontal limitado */}
      <Card className="shadow-card w-full min-w-0">
        <CardContent className="p-6 w-full min-w-0 overflow-hidden">
          <LeadKanban
            leadsByStatus={leadsByStatus}
            onMoveLead={moveLead}
            onDeleteLead={deleteLead}
            onUpdateLead={updateLead}
          />
        </CardContent>
      </Card>
    </div>
  );
}
