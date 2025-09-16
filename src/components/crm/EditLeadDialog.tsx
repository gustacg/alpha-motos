import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScoringInput } from "@/components/ui/scoring-input";
import { Lead } from "@/types/lead";
import { useBodyPointerEvents } from "@/hooks/useBodyPointerEvents";

interface EditLeadDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (id: string, leadData: Partial<Lead>) => void;
}

export function EditLeadDialog({ lead, isOpen, onClose, onUpdateLead }: EditLeadDialogProps) {
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

  // Hook para gerenciar pointer-events do body
  const { ensureBodyInteractive, cleanupBodyStyle } = useBodyPointerEvents();

  // Lista de vendedoras disponíveis
  const vendedoras = [
    'Diego',
    'Kelly',
    'Viviane',
    'Ricardo'
  ];

  useEffect(() => {
    if (lead && isOpen) {
      setFormData({
        nome: lead.nome || '',
        telefone: lead.telefone || '',
        vendedora: lead.vendedora || '',
        email: lead.email || '',
        cpf: lead.cpf || '',
        endereco: lead.endereco || '',
        contato_emergencia_nome: lead.contato_emergencia_nome || '',
        contato_emergencia_telefone: lead.contato_emergencia_telefone || '',
        score: lead.score || 50
      });
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead) return;

    const leadData: Partial<Lead> = {
      nome: formData.nome,
      telefone: formData.telefone,
      vendedora: formData.vendedora,
      email: formData.email || undefined,
      cpf: formData.cpf || undefined,
      endereco: formData.endereco || undefined,
      contato_emergencia_nome: formData.contato_emergencia_nome || undefined,
      contato_emergencia_telefone: formData.contato_emergencia_telefone || undefined,
      score: formData.score
    };

    try {
      console.log('💾 Salvando lead...');
      await onUpdateLead(lead.id, leadData);
      
      // SOLUÇÃO CRÍTICA: Garantir que body está interativo após salvar
      setTimeout(() => {
        ensureBodyInteractive();
        console.log('✅ Lead salvo com sucesso - body interativo garantido');
      }, 100);
      
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      // Em caso de erro, ainda garantir que body está interativo
      ensureBodyInteractive();
    }
  };

  const handleClose = () => {
    // SOLUÇÃO CRÍTICA: Limpar body style antes de fechar
    cleanupBodyStyle();
    
    onClose();
    
    // Reset form data quando fechar
    if (lead) {
      setFormData({
        nome: lead.nome || '',
        telefone: lead.telefone || '',
        vendedora: lead.vendedora || '',
        email: lead.email || '',
        cpf: lead.cpf || '',
        endereco: lead.endereco || '',
        contato_emergencia_nome: lead.contato_emergencia_nome || '',
        contato_emergencia_telefone: lead.contato_emergencia_telefone || '',
        score: lead.score || 50
      });
    }

    // Garantir que body está interativo após um delay
    setTimeout(() => {
      ensureBodyInteractive();
    }, 200);
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Editar Lead - <span className="break-words">{lead.nome}</span></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            label="Score"
            value={formData.score}
            onChange={(score) => setFormData({ ...formData, score })}
          />

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
