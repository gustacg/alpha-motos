export type LeadStatus = 'lead' | 'qualificado' | 'consultar' | 'agendamento' | 'nao_comparecimento' | 'contrato' | 'cliente' | 'distrato' | 'curioso' | 'descartado';

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  vendedora: string;
  email?: string;
  cpf?: string;
  endereco?: string;
  contato_emergencia_nome?: string;
  contato_emergencia_telefone?: string;
  score: number;
  tipo: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface Interesse {
  id: string;
  lead_id: string;
  data_interesse: string;
  modelo_moto?: string;
  cor_preferida?: string;
  valor_interesse?: number;
  observacoes?: string;
  created_at: string;
}

export interface TentativaFinanciamento {
  id: string;
  lead_id: string;
  data_tentativa: string;
  valor_entrada?: number;
  numero_parcelas?: number;
  valor_total_moto?: number;
  valor_parcela?: number;
  status?: string;
  created_at: string;
}

export interface Processo {
  id: string;
  lead_id: string;
  tipo_processo?: string;
  data_processo?: string;
  local_comarca?: string;
  status_processo?: string;
  observacoes?: string;
  created_at: string;
}

export interface LeadWithHistory extends Lead {
  interesses?: Interesse[];
  tentativas_financiamento?: TentativaFinanciamento[];
  processos?: Processo[];
}

export interface LeadFilters {
  search: string;
  scoringRange?: 'high' | 'medium' | 'low';
  interestModel?: string;
}