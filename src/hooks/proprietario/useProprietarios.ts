import { useEffect, useState, useCallback } from "react";
import { toError } from '../../utils/errors';
import { IProprietario } from "../../interfaces/proprietario.interface";
import ProprietarioService from "../../services/ProprietarioService";

export default function useProprietarios() {
  const [proprietarios, setProprietarios] = useState<IProprietario[]>([]);
  const [loadingProprietario, setLoadingProprietario] = useState<boolean>(true);
  const [erroProprietario, setErroProprietario] = useState<Error | null>(null);

  const refetchProprietarios = useCallback(async () => {
    setLoadingProprietario(true);
    setErroProprietario(null);
    try {
      const dados = await ProprietarioService.listarProprietarios();
      setProprietarios(dados);
    } catch (erro: unknown) {
      setErroProprietario(toError(erro, 'Erro ao carregar proprietários.'));
    } finally {
      setLoadingProprietario(false);
    }
  }, []);

  useEffect(() => {
    refetchProprietarios();
  }, [refetchProprietarios]);

  return {
    proprietarios,
    loadingProprietario,
    erroProprietario,
    refetchProprietarios,
  };
}
