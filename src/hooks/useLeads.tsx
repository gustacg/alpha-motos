import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadStatus, LeadFilters, LeadWithHistory, Interesse, TentativaFinanciamento, Processo } from '@/types/lead';

// Função para normalizar strings removendo caracteres especiais
const normalizeString = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.replace(/[^\w]/g, '').toLowerCase();
};

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>({
    search: ''
  });

  // Carregar leads do Supabase
  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar leads:', error);
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const normalizedSearch = normalizeString(filters.search);
      
      const matchesSearch = normalizedSearch === '' ||
                           normalizeString(lead.nome).includes(normalizedSearch) ||
                           normalizeString(lead.email).includes(normalizedSearch) ||
                           normalizeString(lead.telefone).includes(normalizedSearch) ||
                           normalizeString(lead.cpf).includes(normalizedSearch);
      
      const matchesScoring = !filters.scoringRange || 
        (filters.scoringRange === 'high' && lead.score >= 80) ||
        (filters.scoringRange === 'medium' && lead.score >= 60 && lead.score < 80) ||
        (filters.scoringRange === 'low' && lead.score < 60);

      return matchesSearch && matchesScoring;
    });
  }, [leads, filters]);

  const leadsByStatus = useMemo(() => {
    const statusOrder: LeadStatus[] = ['lead', 'consultar', 'qualificado', 'agendado', 'nao_compareceu', 'contrato_feito', 'venda_concluida', 'distrato', 'descartado'];
    
    const groupedByStatus = statusOrder.reduce((acc, status) => {
      acc[status] = filteredLeads.filter(lead => lead.tipo === status);
      return acc;
    }, {} as Record<LeadStatus, Lead[]>);

    return statusOrder.map(status => ({
      status,
      leads: groupedByStatus[status],
      count: groupedByStatus[status].length
    }));
  }, [filteredLeads]);

  const updateFilters = (newFilters: Partial<LeadFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const moveLead = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ tipo: newStatus })
        .eq('id', leadId);

      if (error) {
        console.error('Erro ao mover lead:', error);
        return;
      }

      // Atualizar estado local
      setLeads(prev => prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, tipo: newStatus, updated_at: new Date().toISOString() }
          : lead
      ));
    } catch (error) {
      console.error('Erro ao mover lead:', error);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar lead:', error);
        return;
      }

      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
    }
  };

  const addLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar lead:', error);
        return;
      }

      setLeads(prev => [data, ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
    }
  };

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar lead:', error);
        return;
      }

      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, ...leadData, updated_at: new Date().toISOString() } : lead
      ));
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  };

  // Carregar histórico completo de um lead
  const getLeadWithHistory = async (leadId: string): Promise<LeadWithHistory | null> => {
    try {
      // Carregar lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (leadError) {
        console.error('Erro ao carregar lead:', leadError);
        return null;
      }

      // Carregar interesses
      const { data: interesses } = await supabase
        .from('interesses')
        .select('*')
        .eq('lead_id', leadId)
        .order('data_interesse', { ascending: false });

      // Carregar tentativas de financiamento
      const { data: tentativas } = await supabase
        .from('tentativas_financiamento')
        .select('*')
        .eq('lead_id', leadId)
        .order('data_tentativa', { ascending: false });

      // Carregar processos
      const { data: processos } = await supabase
        .from('processos')
        .select('*')
        .eq('lead_id', leadId)
        .order('data_processo', { ascending: false });

      return {
        ...leadData,
        interesses: interesses || [],
        tentativas_financiamento: tentativas || [],
        processos: processos || []
      };
    } catch (error) {
      console.error('Erro ao carregar histórico do lead:', error);
      return null;
    }
  };

  return {
    leads: filteredLeads,
    leadsByStatus,
    filters,
    loading,
    updateFilters,
    moveLead,
    deleteLead,
    addLead,
    updateLead,
    getLeadWithHistory
  };
}