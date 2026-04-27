import { useCallback, useEffect, useState } from 'react';
import ClienteService from '../../services/ClienteService';
import { ICliente } from '../../interfaces/cliente.interface';

interface UseClientesReturn {
  clientes: ICliente[];
  loadingClientes: boolean;
  erroClientes: string | null;
  refetchClientes: () => Promise<void>;
}

export function useClientes(): UseClientesReturn {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState<boolean>(true);
  const [erroClientes, setErroClientes] = useState<string | null>(null);

  const buscarClientes = useCallback(async () => {
    try {
      setLoadingClientes(true);
      setErroClientes(null);

      const data = await ClienteService.listarClientes();
      setClientes(data);
    } catch (error: any) {
      setErroClientes(
        error?.response?.data?.message ||
          'Erro ao carregar clientes.'
      );
    } finally {
      setLoadingClientes(false);
    }
  }, []);

  useEffect(() => {
    buscarClientes();
  }, [buscarClientes]);

  return {
    clientes,
    loadingClientes,
    erroClientes,
    refetchClientes: buscarClientes,
  };
}