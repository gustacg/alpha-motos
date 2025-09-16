-- Migração para adicionar o campo vendedora na tabela leads
-- Execute este SQL no painel do Supabase SQL Editor

-- Adicionar coluna vendedora
ALTER TABLE leads ADD COLUMN vendedora text NOT NULL DEFAULT 'Não definida';

-- Atualizar RLS policies se necessário
-- (As políticas existentes devem continuar funcionando)

-- Comentários sobre a migração:
-- 1. O campo vendedora é obrigatório (NOT NULL)
-- 2. Valor padrão 'Não definida' para dados existentes
-- 3. Aplicar esta migração antes de usar a nova versão do frontend
-- 4. Leads existentes receberão 'Não definida' como vendedora padrão
