import { useEffect } from 'react';
import { usePageTitle as usePageTitleContext } from '@/contexts/PageTitleContext';

export function usePageTitle(title: string) {
  const { setPageTitle } = usePageTitleContext();
  
  useEffect(() => {
    setPageTitle(title);
  }, [title, setPageTitle]);
}