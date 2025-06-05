import { useEffect, useState, useCallback } from "react";
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
    } catch (erro: any) {
      setErroProprietario(erro);
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
