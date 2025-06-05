import { useEffect, useState, useCallback } from "react";
import { ICliente } from "../../interfaces/cliente.interface";
import ClienteService from "../../services/ClienteService";

export default function useClientes() {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [loadingCliente, setLoadingCliente] = useState<boolean>(true);
  const [erroCliente, setErroCliente] = useState<Error | null>(null);

  const refetchClientes = useCallback(async () => {
    setLoadingCliente(true);
    setErroCliente(null);
    try {
      const dados = await ClienteService.listarClientes();
      setClientes(dados);
    } catch (erro: any) {
      setErroCliente(erro);
    } finally {
      setLoadingCliente(false);
    }
  }, []);

  useEffect(() => {
    refetchClientes();
  }, [refetchClientes]);

  return {
    clientes,
    loadingCliente,
    erroCliente,
    refetchClientes,
  };
}


