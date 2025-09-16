import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Star } from "lucide-react";
import { Lead } from "@/types/lead";
import { useSafeDraggable } from "@/hooks/useSafeDraggable";
import { LeadContextMenu } from "./LeadContextMenu";
import { memo } from "react";

interface LeadCardProps {
  lead: Lead;
  onDelete: (id: string) => void;
  onEdit?: (lead: Lead) => void;
  onClick?: () => void;
}


export const LeadCard = memo(function LeadCard({ lead, onDelete, onEdit, onClick }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    isActive
  } = useSafeDraggable(lead.id);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(lead);
    }
  };

  const handleDelete = () => {
    onDelete(lead.id);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 61) return 'text-green-600';
    if (score >= 31) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <LeadContextMenu onEdit={handleEdit} onDelete={handleDelete}>
      <Card 
        ref={setNodeRef}
        style={style}
        className={`shadow-card hover:shadow-elevated transition-all duration-300 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''} ${!isActive ? 'pointer-events-none' : ''}`}
        onClick={isActive ? handleClick : undefined}
        {...(isActive ? attributes : {})}
        {...(isActive ? listeners : {})}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm truncate">{lead.nome}</h3>
            <div className="flex items-center gap-1 text-xs">
              <Star className={`h-3 w-3 ${getScoreColor(lead.score)}`} />
              <span className={getScoreColor(lead.score)}>{lead.score}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{lead.telefone}</span>
          </div>

          <div className="text-xs text-muted-foreground">
            <span>Vendedora: </span>
            <Badge variant="outline" className="text-xs py-0 px-1">
              {lead.vendedora || 'Não definida'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </LeadContextMenu>
  );
});