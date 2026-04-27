import { useState } from 'react';
import ClienteService from '../../services/ClienteService';
import { ICliente } from '../../interfaces/cliente.interface';

interface UseClientesPorNomeReturn {
  clientesEncontrados: ICliente[];
  loadingBusca: boolean;
  erroBusca: string | null;
  buscarClientesPorNome: (nome: string) => Promise<ICliente[]>;
  limparBusca: () => void;
}

export function useClientesPorNome(): UseClientesPorNomeReturn {
  const [clientesEncontrados, setClientesEncontrados] = useState<ICliente[]>([]);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [erroBusca, setErroBusca] = useState<string | null>(null);

  const buscarClientesPorNome = async (nome: string): Promise<ICliente[]> => {
    try {
      setLoadingBusca(true);
      setErroBusca(null);

      const clientes = await ClienteService.buscarClientesPorNome(nome);
      setClientesEncontrados(clientes);

      return clientes;
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.message || 'Erro ao buscar clientes.';
      setErroBusca(mensagem);
      setClientesEncontrados([]);
      return [];
    } finally {
      setLoadingBusca(false);
    }
  };

  const limparBusca = () => {
    setClientesEncontrados([]);
    setErroBusca(null);
    setLoadingBusca(false);
  };

  return {
    clientesEncontrados,
    loadingBusca,
    erroBusca,
    buscarClientesPorNome,
    limparBusca,
  };
}