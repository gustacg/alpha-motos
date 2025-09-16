import { useDraggable } from "@dnd-kit/core";
import { useRef, useEffect } from "react";

/**
 * Hook que encapsula useDraggable com cleanup automático
 * para prevenir problemas de event listeners órfãos
 */
export function useSafeDraggable(id: string) {
  const isActiveRef = useRef(true);
  
  const draggableResult = useDraggable({
    id: id,
    disabled: !isActiveRef.current
  });

  // Cleanup quando o componente é desmontado
  useEffect(() => {
    isActiveRef.current = true;
    
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  // Re-enable quando o ID muda (lead atualizado)
  useEffect(() => {
    isActiveRef.current = true;
  }, [id]);

  return {
    ...draggableResult,
    isActive: isActiveRef.current
  };
}
