import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lead, LeadWithHistory, Interesse, TentativaFinanciamento, Processo } from "@/types/lead";
import { useLeads } from "@/hooks/useLeads";
import { supabase } from '@/integrations/supabase/client';
import { User, Phone, Mail, MapPin, Users, Star, Calendar, DollarSign, FileText, Plus } from "lucide-react";

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusLabels = {
  lead: 'Lead',
  consultar: 'Consultar',
  qualificado: 'Qualificado',
  agendado: 'Agendado',
  nao_compareceu: 'Não Compareceu',
  contrato_feito: 'Contrato feito',
  venda_concluida: 'Venda concluída',
  distrato: 'Distrato',
  descartado: 'Descartado'
};

export function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  const { getLeadWithHistory, updateLead } = useLeads();
  const [leadWithHistory, setLeadWithHistory] = useState<LeadWithHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (lead && isOpen) {
      loadLeadDetails();
    }
  }, [lead, isOpen]);

  const loadLeadDetails = async () => {
    if (!lead) return;
    
    setLoading(true);
    try {
      const details = await getLeadWithHistory(lead.id);
      setLeadWithHistory(details);
    } catch (error) {
      console.error('Erro ao carregar detalhes do lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInteresse = async (interesse: Omit<Interesse, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('interesses')
        .insert([interesse])
        .select()
        .single();
      
      if (error) throw error;
      
      // Recarregar dados
      await loadLeadDetails();
    } catch (error) {
      console.error('Erro ao adicionar interesse:', error);
    }
  };

  const handleAddTentativaFinanciamento = async (tentativa: Omit<TentativaFinanciamento, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tentativas_financiamento')
        .insert([tentativa])
        .select()
        .single();
      
      if (error) throw error;
      
      // Recarregar dados
      await loadLeadDetails();
    } catch (error) {
      console.error('Erro ao adicionar tentativa de financiamento:', error);
    }
  };

  const handleAddProcesso = async (processo: Omit<Processo, 'id' | 'created_at'>, isDesqualificado?: boolean) => {
    try {
      const { data, error } = await supabase
        .from('processos')
        .insert([processo])
        .select()
        .single();
      
      if (error) throw error;
      
      // Se marcado como desqualificado, mover para "Descartado"
      if (isDesqualificado && lead) {
        await updateLead(lead.id, { tipo: 'descartado' });
      }
      
      // Recarregar dados
      await loadLeadDetails();
    } catch (error) {
      console.error('Erro ao adicionar processo:', error);
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {lead.nome}
              <Badge variant="outline" className="ml-2">
                {statusLabels[lead.tipo]}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Score</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-primary">
                    {lead.score}
                  </div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Star className={`h-4 w-4 ${lead.score >= 61 ? 'text-green-600' : lead.score >= 31 ? 'text-yellow-600' : 'text-red-600'}`} />
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-lg text-muted-foreground">Carregando detalhes...</div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="interests">Histórico de Interesses</TabsTrigger>
              <TabsTrigger value="financial">Histórico Financeiro</TabsTrigger>
              <TabsTrigger value="processes">Histórico de Processos</TabsTrigger>
            </TabsList>

            {/* Seção 1: Dados Pessoais */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Tipo (Etapa Atual)</Label>
                        <p className="text-sm">{statusLabels[lead.tipo]}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Nome</Label>
                        <p className="text-sm">{lead.nome}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Vendedora</Label>
                        <p className="text-sm">{lead.vendedora || 'Não definida'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">CPF</Label>
                        <p className="text-sm">{lead.cpf || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm">{lead.email || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Telefone</Label>
                        <p className="text-sm">{lead.telefone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Endereço</Label>
                        <p className="text-sm">{lead.endereco || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Contato de Emergência</Label>
                        <p className="text-sm">
                          {lead.contato_emergencia_nome ? 
                            `${lead.contato_emergencia_nome} - ${lead.contato_emergencia_telefone || 'Sem telefone'}` : 
                            'Não informado'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Seção 2: Histórico de Interesses */}
            <TabsContent value="interests" className="space-y-4">
              <HistoricoInteressesSection 
                leadId={lead.id} 
                interesses={leadWithHistory?.interesses || []}
                onAdd={handleAddInteresse}
              />
            </TabsContent>

            {/* Seção 3: Histórico Financeiro */}
            <TabsContent value="financial" className="space-y-4">
              <HistoricoFinanceiroSection 
                leadId={lead.id}
                tentativas={leadWithHistory?.tentativas_financiamento || []}
                onAdd={handleAddTentativaFinanciamento}
              />
            </TabsContent>

            {/* Seção 4: Histórico de Processos */}
            <TabsContent value="processes" className="space-y-4">
              <HistoricoProcessosSection 
                leadId={lead.id}
                processos={leadWithHistory?.processos || []}
                onAdd={handleAddProcesso}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Componente para Seção de Histórico de Interesses
function HistoricoInteressesSection({ 
  leadId, 
  interesses, 
  onAdd 
}: { 
  leadId: string; 
  interesses: Interesse[]; 
  onAdd: (interesse: Omit<Interesse, 'id' | 'created_at'>) => void; 
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    data_interesse: new Date().toISOString().split('T')[0],
    modelo: '',
    ano: '',
    cor_preferida: '',
    valor_interesse: '',
    observacoes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let modelo_moto = undefined;
    if (formData.modelo && formData.ano) modelo_moto = `${formData.modelo} ${formData.ano}`;
    else if (formData.modelo) modelo_moto = formData.modelo;
    else if (formData.ano) modelo_moto = formData.ano;
    onAdd({
      lead_id: leadId,
      data_interesse: formData.data_interesse,
      modelo_moto,
      cor_preferida: formData.cor_preferida || undefined,
      valor_interesse: formData.valor_interesse ? parseFloat(formData.valor_interesse) : undefined,
      observacoes: formData.observacoes || undefined
    });
    setFormData({
      data_interesse: new Date().toISOString().split('T')[0],
      modelo: '',
      ano: '',
      cor_preferida: '',
      valor_interesse: '',
      observacoes: ''
    });
    setShowForm(false);
  };

  const MOTO_MODELOS = [
    'CG 150 Titan', 'CG 125 Fan', 'CG 150 Fan', 'CG 150 Start', 'CG 160 Start', 'CG 160 Fan', 'CG 160 Titan',
    'Tornado 250', 'NXR 150 Bros', 'NXR 125 Bros', 'NXR 160 Bros', 'XRE 190', 'XRE 300', 'PCX 150', 'PCX 160',
    'ELITE 125', 'POP 100', 'POP 110i', 'Crosser 150', 'Fazer 150', 'Fazer 250', 'Factor 125', 'Factor 150'
  ];
  const ANOS = [
    '2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Histórico de Interesses
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 border rounded p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_interesse">Data do Interesse</Label>
                <Input
                  id="data_interesse"
                  type="date"
                  value={formData.data_interesse}
                  onChange={(e) => setFormData({ ...formData, data_interesse: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo da Moto</Label>
                <Select
                  value={formData.modelo}
                  onValueChange={value => setFormData({ ...formData, modelo: value })}
                >
                  <SelectTrigger id="modelo">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOTO_MODELOS.map((modelo) => (
                      <SelectItem key={modelo} value={modelo}>{modelo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ano">Ano</Label>
                <Select
                  value={formData.ano}
                  onValueChange={value => setFormData({ ...formData, ano: value })}
                >
                  <SelectTrigger id="ano">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANOS.map((ano) => (
                      <SelectItem key={ano} value={ano}>{ano}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cor_preferida">Cor Preferida</Label>
                <Input
                  id="cor_preferida"
                  value={formData.cor_preferida}
                  onChange={(e) => setFormData({ ...formData, cor_preferida: e.target.value })}
                  placeholder="Ex: Vermelha"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor_interesse">Valor de Interesse</Label>
                <Input
                  id="valor_interesse"
                  type="number"
                  step="0.01"
                  value={formData.valor_interesse}
                  onChange={(e) => setFormData({ ...formData, valor_interesse: e.target.value })}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações específicas sobre o interesse..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">Adicionar</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <ScrollArea className="h-60">
          <div className="space-y-2">
            {interesses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum interesse registrado ainda
              </p>
            ) : (
              interesses.map((interesse) => (
                <div key={interesse.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">
                        {interesse.modelo_moto || 'Modelo não especificado'}
                      </p>
                      {interesse.cor_preferida && (
                        <p className="text-muted-foreground">Cor: {interesse.cor_preferida}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(interesse.data_interesse).toLocaleDateString('pt-BR')}
                      </p>
                      {interesse.valor_interesse && (
                        <p className="text-xs font-medium text-green-600">
                          R$ {interesse.valor_interesse.toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  {interesse.observacoes && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {interesse.observacoes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Componente para Seção de Histórico Financeiro
function HistoricoFinanceiroSection({ 
  leadId, 
  tentativas, 
  onAdd 
}: { 
  leadId: string; 
  tentativas: TentativaFinanciamento[]; 
  onAdd: (tentativa: Omit<TentativaFinanciamento, 'id' | 'created_at'>) => void; 
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    data_tentativa: new Date().toISOString().split('T')[0],
    valor_entrada: '',
    numero_parcelas: '',
    valor_total_moto: '',
    valor_parcela: '',
    status: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      lead_id: leadId,
      data_tentativa: formData.data_tentativa,
      valor_entrada: formData.valor_entrada ? parseFloat(formData.valor_entrada) : undefined,
      numero_parcelas: formData.numero_parcelas ? parseInt(formData.numero_parcelas) : undefined,
      valor_total_moto: formData.valor_total_moto ? parseFloat(formData.valor_total_moto) : undefined,
      valor_parcela: formData.valor_parcela ? parseFloat(formData.valor_parcela) : undefined,
      status: formData.status || undefined
    });
    
    setFormData({
      data_tentativa: new Date().toISOString().split('T')[0],
      valor_entrada: '',
      numero_parcelas: '',
      valor_total_moto: '',
      valor_parcela: '',
      status: ''
    });
    setShowForm(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Histórico Financeiro
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 border rounded p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_tentativa">Data da Tentativa</Label>
                <Input
                  id="data_tentativa"
                  type="date"
                  value={formData.data_tentativa}
                  onChange={(e) => setFormData({ ...formData, data_tentativa: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="valor_entrada">Valor da Entrada</Label>
                <Input
                  id="valor_entrada"
                  type="number"
                  step="0.01"
                  value={formData.valor_entrada}
                  onChange={(e) => setFormData({ ...formData, valor_entrada: e.target.value })}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="numero_parcelas">Número de Parcelas</Label>
                <Input
                  id="numero_parcelas"
                  type="number"
                  value={formData.numero_parcelas}
                  onChange={(e) => setFormData({ ...formData, numero_parcelas: e.target.value })}
                  placeholder="12"
                />
              </div>
              <div>
                <Label htmlFor="valor_total_moto">Valor Total da Moto</Label>
                <Input
                  id="valor_total_moto"
                  type="number"
                  step="0.01"
                  value={formData.valor_total_moto}
                  onChange={(e) => setFormData({ ...formData, valor_total_moto: e.target.value })}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="valor_parcela">Valor das Parcelas</Label>
                <Input
                  id="valor_parcela"
                  type="number"
                  step="0.01"
                  value={formData.valor_parcela}
                  onChange={(e) => setFormData({ ...formData, valor_parcela: e.target.value })}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status da Tentativa</Label>
              <Input
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                placeholder="Ex: Aprovado, Reprovado, Em análise"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">Adicionar</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <ScrollArea className="h-60">
          <div className="space-y-2">
            {tentativas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma tentativa de financiamento registrada ainda
              </p>
            ) : (
              tentativas.map((tentativa) => (
                <div key={tentativa.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">
                        {new Date(tentativa.data_tentativa).toLocaleDateString('pt-BR')}
                      </p>
                      {tentativa.status && (
                        <Badge variant="outline" className="mt-1">
                          {tentativa.status}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      {tentativa.valor_total_moto && (
                        <p className="text-xs font-medium">
                          Total: R$ {tentativa.valor_total_moto.toLocaleString('pt-BR')}
                        </p>
                      )}
                      {tentativa.valor_entrada && (
                        <p className="text-xs text-muted-foreground">
                          Entrada: R$ {tentativa.valor_entrada.toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  {(tentativa.numero_parcelas && tentativa.valor_parcela) && (
                    <p className="text-xs text-muted-foreground">
                      {tentativa.numero_parcelas}x de R$ {tentativa.valor_parcela.toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Componente para Seção de Histórico de Processos
function HistoricoProcessosSection({ 
  leadId, 
  processos, 
  onAdd 
}: { 
  leadId: string; 
  processos: Processo[]; 
  onAdd: (processo: Omit<Processo, 'id' | 'created_at'>, isDesqualificado?: boolean) => void; 
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo_processo: '',
    data_processo: new Date().toISOString().split('T')[0],
    local_comarca: '',
    status_processo: '',
    observacoes: '',
    qualificacao: 'qualificado'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDesqualificado = formData.qualificacao === 'desqualificado';
    
    onAdd({
      lead_id: leadId,
      tipo_processo: formData.tipo_processo || undefined,
      data_processo: formData.data_processo || undefined,
      local_comarca: formData.local_comarca || undefined,
      status_processo: formData.status_processo || undefined,
      observacoes: formData.observacoes || undefined
    }, isDesqualificado);
    
    setFormData({
      tipo_processo: '',
      data_processo: new Date().toISOString().split('T')[0],
      local_comarca: '',
      status_processo: '',
      observacoes: '',
      qualificacao: 'qualificado'
    });
    setShowForm(false);
  };

  // Determinar status de qualificação
  const isQualificado = processos.length === 0 || processos.some(p => 
    p.status_processo?.toLowerCase().includes('finalizado') ||
    p.status_processo?.toLowerCase().includes('arquivado') ||
    p.status_processo?.toLowerCase().includes('sem pendências')
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Histórico de Processos
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={isQualificado ? "default" : "destructive"}>
            Status: {isQualificado ? "Qualificado" : "Não Qualificado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 border rounded p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo_processo">Tipo de Processo</Label>
                <Input
                  id="tipo_processo"
                  value={formData.tipo_processo}
                  onChange={(e) => setFormData({ ...formData, tipo_processo: e.target.value })}
                  placeholder="Ex: Ação Civil, Execução Fiscal"
                />
              </div>
              <div>
                <Label htmlFor="data_processo">Data do Processo</Label>
                <Input
                  id="data_processo"
                  type="date"
                  value={formData.data_processo}
                  onChange={(e) => setFormData({ ...formData, data_processo: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="local_comarca">Local/Comarca</Label>
                <Input
                  id="local_comarca"
                  value={formData.local_comarca}
                  onChange={(e) => setFormData({ ...formData, local_comarca: e.target.value })}
                  placeholder="Ex: 1ª Vara Cível - São Paulo/SP"
                />
              </div>
              <div>
                <Label htmlFor="status_processo">Status Atual</Label>
                <Input
                  id="status_processo"
                  value={formData.status_processo}
                  onChange={(e) => setFormData({ ...formData, status_processo: e.target.value })}
                  placeholder="Ex: Em andamento, Finalizado"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="qualificacao">Status de Qualificação *</Label>
              <Select
                value={formData.qualificacao}
                onValueChange={(value) => setFormData({ ...formData, qualificacao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Qualificado ou Desqualificado?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qualificado">✅ Qualificado</SelectItem>
                  <SelectItem value="desqualificado">❌ Desqualificado (mover para Descartado)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Detalhes adicionais sobre o processo..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">Adicionar</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <ScrollArea className="h-60">
          <div className="space-y-2">
            {processos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum processo registrado ainda
              </p>
            ) : (
              processos.map((processo) => (
                <div key={processo.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">
                        {processo.tipo_processo || 'Tipo não especificado'}
                      </p>
                      {processo.local_comarca && (
                        <p className="text-xs text-muted-foreground">
                          {processo.local_comarca}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {processo.data_processo && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(processo.data_processo).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                      {processo.status_processo && (
                        <Badge variant="outline" className="mt-1">
                          {processo.status_processo}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {processo.observacoes && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {processo.observacoes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}