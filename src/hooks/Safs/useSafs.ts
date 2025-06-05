import { useEffect, useState, useCallback } from "react";
import SafService from "../../services/SafService";
import { ISAF } from "../../interfaces/SAF.interface";

export default function useSafs() {
  const [safs, setSafs] = useState<ISAF[]>([]);
  const [loadingSaf, setLoadingSaf] = useState<boolean>(true);
  const [erroSaf, setErroSaf] = useState<Error | null>(null);

  const refetchSafs = useCallback(async () => {
    setLoadingSaf(true);
    setErroSaf(null);
    try {
      const dados = await SafService.listarSafs();
      setSafs(dados);
    } catch (erro: any) {
      setErroSaf(erro);
    } finally {
      setLoadingSaf(false);
    }
  }, []);

  useEffect(() => {
    refetchSafs();
  }, [refetchSafs]);

  return {
    safs,
    loadingSaf,
    erroSaf,
    refetchSafs,
  };
}
