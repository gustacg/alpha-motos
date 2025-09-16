import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, rectIntersection, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useState } from "react";
import { Lead, LeadStatus } from "@/types/lead";
import { KanbanColumn } from "./KanbanColumn";
import { LeadCard } from "./LeadCard";

interface LeadKanbanProps {
  leadsByStatus: Array<{
    status: LeadStatus;
    leads: Lead[];
    count: number;
  }>;
  onMoveLead: (leadId: string, newStatus: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onUpdateLead: (id: string, leadData: Partial<Lead>) => void;
}

const statusTitles: Record<LeadStatus, string> = {
  lead: 'Lead',
  qualificado: 'Qualificado',
  consultar: 'Consultar',
  agendamento: 'Agendamento',
  nao_comparecimento: 'Não Comparecimento',
  contrato: 'Contrato',
  cliente: 'Cliente',
  distrato: 'Distrato',
  curioso: 'Curioso',
  descartado: 'Descartado'
};

export function LeadKanban({ leadsByStatus, onMoveLead, onDeleteLead, onUpdateLead }: LeadKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Find the active lead
    const lead = leadsByStatus.flatMap(column => column.leads).find(lead => lead.id === active.id);
    setActiveLead(lead || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveLead(null);
      return;
    }

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    // Find current status
    const currentColumn = leadsByStatus.find(column => 
      column.leads.some(lead => lead.id === leadId)
    );

    if (currentColumn && currentColumn.status !== newStatus) {
      onMoveLead(leadId, newStatus);
    }

    setActiveId(null);
    setActiveLead(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full overflow-x-auto overflow-y-hidden kanban-container">
        <div className="flex gap-4 pb-4 min-h-[600px] kanban-content" style={{ minWidth: 'max-content' }}>
        {leadsByStatus.map(({ status, leads, count }) => (
          <KanbanColumn
            key={status}
            status={status}
            title={statusTitles[status]}
            leads={leads}
            count={count}
            onDeleteLead={onDeleteLead}
            onUpdateLead={onUpdateLead}
          />
        ))}
        </div>
      </div>

      <DragOverlay>
        {activeId && activeLead ? (
          <LeadCard lead={activeLead} onDelete={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}