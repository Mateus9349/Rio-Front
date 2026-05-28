import { useCallback, useEffect, useRef, useState } from "react";
import SafService from "../../services/SafService";
import type { ISAF } from "../../interfaces/SAF.interface";

/**
 * Hook para carregar e gerenciar a lista de SAFs.
 * Retorna: safs, loadingSaf, erroSaf, refetchSafs e helpers para manter cache local.
 */
export default function useSafs() {
  const [safs, setSafs] = useState<ISAF[]>([]);
  const [loadingSaf, setLoadingSaf] = useState<boolean>(true);
  const [erroSaf, setErroSaf] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchSafs = useCallback(async () => {
    setLoadingSaf(true);
    setErroSaf(null);
    try {
      const data = await SafService.listarSafs();
      if (!mountedRef.current) return;
      setSafs(Array.isArray(data) ? data : []);
    } catch (e) {
      if (!mountedRef.current) return;
      setErroSaf(e as Error);
    } finally {
      if (mountedRef.current) {
        setLoadingSaf(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchSafs();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchSafs]);

  // Helpers para manter o cache local em sincronia após mutações
  const upsertLocal = useCallback((next: ISAF) => {
    setSafs((prev) => {
      const idx = prev.findIndex((s) => s.id === next.id);
      if (idx >= 0) {
        const clone = prev.slice();
        clone[idx] = next;
        return clone;
      }
      return [next, ...prev];
    });
  }, []);

  const removeLocal = useCallback((id: string) => {
    setSafs((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const refetchSafs = fetchSafs;

  return { safs, loadingSaf, erroSaf, refetchSafs, setSafs, upsertLocal, removeLocal };
}
