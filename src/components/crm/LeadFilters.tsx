import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { LeadFilters as LeadFiltersType } from "@/types/lead";

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFiltersChange: (filters: Partial<LeadFiltersType>) => void;
  addLeadButton?: React.ReactNode;
}

export function LeadFilters({ filters, onFiltersChange, addLeadButton }: LeadFiltersProps) {
  const vendedoras = ['Diego', 'Kelly', 'Viviane', 'Ricardo'];

  return (
    <div className="w-full">
      {/* Layout Desktop/Tablet: horizontal com botão no final */}
      <div className="hidden md:flex items-center justify-between gap-3">
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

          <Select
            value={filters.vendedora || "all"}
            onValueChange={(value) => onFiltersChange({ vendedora: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Vendedora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {vendedoras.map((vendedora) => (
                <SelectItem key={vendedora} value={vendedora}>
                  {vendedora}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Botão adicionar no desktop */}
        {addLeadButton && (
          <div className="flex-shrink-0">
            {addLeadButton}
          </div>
        )}
      </div>

      {/* Layout Mobile: vertical conforme solicitado */}
      <div className="flex md:hidden flex-col gap-3 w-full">
        {/* 1. Campo de busca ocupando toda a largura */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Nome, email, telefone ou CPF..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10 w-full"
          />
        </div>

        {/* 2. Dois filtros dividindo a largura */}
        <div className="flex gap-3 w-full">
          <Select
            value={filters.scoringRange || "all"}
            onValueChange={(value) => onFiltersChange({ scoringRange: value === "all" ? undefined : value as any })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os scores</SelectItem>
              <SelectItem value="high">Alto (80-100)</SelectItem>
              <SelectItem value="medium">Médio (60-79)</SelectItem>
              <SelectItem value="low">Baixo (0-59)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.vendedora || "all"}
            onValueChange={(value) => onFiltersChange({ vendedora: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Vendedora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {vendedoras.map((vendedora) => (
                <SelectItem key={vendedora} value={vendedora}>
                  {vendedora}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}