import { useEffect, useState, useCallback } from "react";
import { IComunidade } from "../../interfaces/comunidade.interface";
import ComunidadeService from "../../services/ComunidadeService";

export default function useComunidades() {
  const [comunidades, setComunidades] = useState<IComunidade[]>([]);
  const [loadingComunidade, setLoadingComunidade] = useState<boolean>(true);
  const [erroComunidade, setErroComunidade] = useState<Error | null>(null);

  const refetchComunidades = useCallback(async () => {
    setLoadingComunidade(true);
    setErroComunidade(null);
    try {
      const dados = await ComunidadeService.listarComunidades();
      setComunidades(dados);
    } catch (erro: any) {
      setErroComunidade(erro);
    } finally {
      setLoadingComunidade(false);
    }
  }, []);

  useEffect(() => {
    refetchComunidades();
  }, [refetchComunidades]);

  return {
    comunidades,
    loadingComunidade,
    erroComunidade,
    refetchComunidades,
  };
}
