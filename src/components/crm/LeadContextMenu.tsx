import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Edit, Trash2 } from "lucide-react";

interface LeadContextMenuProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

export function LeadContextMenu({ children, onEdit, onDelete }: LeadContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Editar Lead
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="gap-2 text-destructive">
          <Trash2 className="h-4 w-4" />
          Remover Lead
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}