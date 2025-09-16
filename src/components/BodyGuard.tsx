import { useEffect } from 'react';

/**
 * Componente guardião que monitora o body continuamente
 * para detectar e corrigir automaticamente pointer-events: none
 * 
 * Deve ser colocado no nível mais alto da aplicação
 */
export function BodyGuard() {
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const guardBody = () => {
      const bodyStyle = getComputedStyle(document.body);
      
      // Verificar se body tem pointer-events: none
      if (bodyStyle.pointerEvents === 'none') {
        console.warn('🚨 BodyGuard: Detectado body com pointer-events: none - CORRIGINDO AUTOMATICAMENTE');
        document.body.style.pointerEvents = 'auto';
        
        // Log adicional para debug
        console.log('🔧 BodyGuard: Body restaurado para pointer-events: auto');
        
        // Verificar se há overlays problemáticos
        const suspiciousOverlays = document.querySelectorAll('[data-state="open"], [data-radix-portal]');
        if (suspiciousOverlays.length > 0) {
          console.log('🔍 BodyGuard: Overlays detectados:', suspiciousOverlays);
        }
      }
    };

    // Executar verificação inicial
    guardBody();

    // Configurar monitoramento contínuo (a cada 500ms)
    intervalId = setInterval(guardBody, 500);

    // Listener para mudanças no DOM que possam afetar o body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Verificar se houve mudanças no style do body
        if (mutation.target === document.body && mutation.type === 'attributes') {
          if (mutation.attributeName === 'style') {
            setTimeout(guardBody, 100); // Verificar após mudanças no style
          }
        }
      });
    });

    // Observar mudanças no body
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Cleanup
    return () => {
      clearInterval(intervalId);
      observer.disconnect();
      console.log('🛡️ BodyGuard: Desativado');
    };
  }, []);

  // Este componente não renderiza nada visualmente
  return null;
}
