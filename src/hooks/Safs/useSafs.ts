import { useEffect, useState, useCallback } from "react";
import SafService from "../../services/SafService";
import { ISAF } from "../../interfaces/SAF.interface";

function numeroDoSaf(identificacao: string): number {
  // pega o último bloco de dígitos da string (ex.: "SAF-012" -> 12)
  const match = identificacao?.match(/\d+/g);
  if (!match || match.length === 0) return -1;
  return parseInt(match[match.length - 1], 10);
}

export default function useSafs() {
  const [safs, setSafs] = useState<ISAF[]>([]);
  const [loadingSaf, setLoadingSaf] = useState<boolean>(true);
  const [erroSaf, setErroSaf] = useState<Error | null>(null);

  const refetchSafs = useCallback(async () => {
    setLoadingSaf(true);
    setErroSaf(null);
    try {
      const dados = await SafService.listarSafs();

      const ordenados = [...dados].sort((a, b) => {
        const nb = numeroDoSaf(b.identificacao);
        const na = numeroDoSaf(a.identificacao);
        if (nb !== na) return nb - na; // decrescente por número
        // empate: ordena decrescente por string para consistência
        return b.identificacao.localeCompare(a.identificacao, undefined, { numeric: true });
      });

      setSafs(ordenados);
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
