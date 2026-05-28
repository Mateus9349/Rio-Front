import { useState } from 'react';
import { getErrorMessage } from '../../utils/errors';
import ClienteService from '../../services/ClienteService';
import {
  ICliente,
  ICreateClienteDto,
} from '../../interfaces/cliente.interface';

interface UseCreateClienteReturn {
  criarCliente: (payload: ICreateClienteDto) => Promise<ICliente | null>;
  loadingCreateCliente: boolean;
  erroCreateCliente: string | null;
  sucessoCreateCliente: boolean;
  resetCreateCliente: () => void;
}

export function useCreateCliente(): UseCreateClienteReturn {
  const [loadingCreateCliente, setLoadingCreateCliente] = useState(false);
  const [erroCreateCliente, setErroCreateCliente] = useState<string | null>(null);
  const [sucessoCreateCliente, setSucessoCreateCliente] = useState(false);

  const criarCliente = async (
    payload: ICreateClienteDto
  ): Promise<ICliente | null> => {
    try {
      setLoadingCreateCliente(true);
      setErroCreateCliente(null);
      setSucessoCreateCliente(false);

      const novoCliente = await ClienteService.criarCliente(payload);

      setSucessoCreateCliente(true);
      return novoCliente;
    } catch (error: unknown) {
      setErroCreateCliente(getErrorMessage(error, 'Erro ao criar cliente.'));
      console.error('Erro ao criar cliente:', error);
      return null;
    } finally {
      setLoadingCreateCliente(false);
    }
  };

  const resetCreateCliente = () => {
    setErroCreateCliente(null);
    setSucessoCreateCliente(false);
    setLoadingCreateCliente(false);
  };

  return {
    criarCliente,
    loadingCreateCliente,
    erroCreateCliente,
    sucessoCreateCliente,
    resetCreateCliente,
  };
}