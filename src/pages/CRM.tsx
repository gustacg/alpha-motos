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
      {/* Header com filtros e botão adicionar */}
      <div className="flex justify-between items-center">
        <LeadFilters
          filters={filters}
          onFiltersChange={updateFilters}
        />
        <AddLeadDialog onAddLead={addLead} />
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
