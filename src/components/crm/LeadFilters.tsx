import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { LeadFilters as LeadFiltersType } from "@/types/lead";

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFiltersChange: (filters: Partial<LeadFiltersType>) => void;
}

export function LeadFilters({ filters, onFiltersChange }: LeadFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Nome, email, telefone ou CPF..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="pl-10 w-64"
        />
      </div>

      <Select
        value={filters.scoringRange || "all"}
        onValueChange={(value) => onFiltersChange({ scoringRange: value === "all" ? undefined : value as any })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Score" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os scores</SelectItem>
          <SelectItem value="high">Alto (80-100)</SelectItem>
          <SelectItem value="medium">Médio (60-79)</SelectItem>
          <SelectItem value="low">Baixo (0-59)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}