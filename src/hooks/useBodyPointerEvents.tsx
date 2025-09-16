import { useEffect, useRef } from 'react';

/**
 * Hook para gerenciar pointer-events do body e prevenir travamentos
 * Causa raiz: body fica com pointer-events: none após edições de modal
 */
export function useBodyPointerEvents() {
  const cleanupTimeoutRef = useRef<NodeJS.Timeout>();

  // Função para forçar pointer-events: auto no body
  const ensureBodyInteractive = () => {
    if (document.body.style.pointerEvents === 'none') {
      console.log('🔧 Corrigindo pointer-events do body de "none" para "auto"');
      document.body.style.pointerEvents = 'auto';
    }
  };

  // Função para cleanup completo do body
  const cleanupBodyStyle = () => {
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
    
    // Remover qualquer classe que possa estar bloqueando interações
    document.body.classList.remove('pointer-events-none', 'overflow-hidden');
    
    console.log('✅ Body style limpo - pointer-events: auto');
  };

  // Verificação periódica de segurança
  const startSafetyCheck = () => {
    cleanupTimeoutRef.current = setInterval(() => {
      const bodyStyle = getComputedStyle(document.body);
      if (bodyStyle.pointerEvents === 'none') {
        console.warn('⚠️ Body com pointer-events: none detectado - corrigindo automaticamente');
        ensureBodyInteractive();
      }
    }, 1000); // Verifica a cada segundo
  };

  // Parar verificação de segurança
  const stopSafetyCheck = () => {
    if (cleanupTimeoutRef.current) {
      clearInterval(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = undefined;
    }
  };

  // Cleanup quando componente é desmontado
  useEffect(() => {
    // Garantir que body está interativo ao montar
    ensureBodyInteractive();
    
    // Iniciar verificação de segurança
    startSafetyCheck();

    return () => {
      stopSafetyCheck();
      cleanupBodyStyle();
    };
  }, []);

  return {
    ensureBodyInteractive,
    cleanupBodyStyle,
    startSafetyCheck,
    stopSafetyCheck
  };
}
