import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScoringInput } from "@/components/ui/scoring-input";
import { Plus } from "lucide-react";
import { Lead } from "@/types/lead";

interface AddLeadDialogProps {
  onAddLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => void;
}

export function AddLeadDialog({ onAddLead }: AddLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    vendedora: '',
    email: '',
    cpf: '',
    endereco: '',
    contato_emergencia_nome: '',
    contato_emergencia_telefone: '',
    score: 50
  });

  // Lista de vendedoras disponíveis
  const vendedoras = [
    'Diego',
    'Kelly',
    'Viviane',
    'Ricardo'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'> = {
      nome: formData.nome,
      telefone: formData.telefone,
      vendedora: formData.vendedora,
      email: formData.email || undefined,
      cpf: formData.cpf || undefined,
      endereco: formData.endereco || undefined,
      contato_emergencia_nome: formData.contato_emergencia_nome || undefined,
      contato_emergencia_telefone: formData.contato_emergencia_telefone || undefined,
      score: formData.score,
      tipo: 'lead'
    };

    onAddLead(leadData);
    setOpen(false);
    setFormData({
      nome: '',
      telefone: '',
      vendedora: '',
      email: '',
      cpf: '',
      endereco: '',
      contato_emergencia_nome: '',
      contato_emergencia_telefone: '',
      score: 50
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                required
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vendedora">Vendedora *</Label>
            <Select
              value={formData.vendedora}
              onValueChange={(value) => setFormData({ ...formData, vendedora: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a vendedora responsável" />
              </SelectTrigger>
              <SelectContent>
                {vendedoras.map((vendedora) => (
                  <SelectItem key={vendedora} value={vendedora}>
                    {vendedora}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="cliente@email.com"
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              placeholder="Rua, número, bairro - Cidade/UF"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contato_emergencia_nome">Contato de Emergência (Nome)</Label>
              <Input
                id="contato_emergencia_nome"
                value={formData.contato_emergencia_nome}
                onChange={(e) => setFormData({ ...formData, contato_emergencia_nome: e.target.value })}
                placeholder="Nome do contato"
              />
            </div>
            <div>
              <Label htmlFor="contato_emergencia_telefone">Contato de Emergência (Telefone)</Label>
              <Input
                id="contato_emergencia_telefone"
                value={formData.contato_emergencia_telefone}
                onChange={(e) => setFormData({ ...formData, contato_emergencia_telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <ScoringInput
            id="score"
            label="Score Inicial"
            value={formData.score}
            onChange={(score) => setFormData({ ...formData, score })}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}