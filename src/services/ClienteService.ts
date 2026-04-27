import { ICliente, ICreateClienteDto, IUpdateClienteDto } from '../interfaces/cliente.interface';
import api from './api.service';

const BASE_URL = '/clientes';

const ClienteService = {
  async listarClientes(): Promise<ICliente[]> {
    const response = await api.get<ICliente[]>(BASE_URL);
    return response.data;
  },

  async buscarCliente(id: number): Promise<ICliente | null> {
    try {
      const response = await api.get<ICliente>(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async buscarClientesPorNome(nome: string): Promise<ICliente[]> {
    const response = await api.get<ICliente[]>(`${BASE_URL}/buscar`, {
      params: { nome },
    });
    return response.data;
  },

  async criarCliente(payload: ICreateClienteDto): Promise<ICliente> {
    const response = await api.post<ICliente>(BASE_URL, payload);
    return response.data;
  },

  async atualizarCliente(id: number, payload: IUpdateClienteDto): Promise<ICliente> {
    const response = await api.patch<ICliente>(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  async removerCliente(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

export default ClienteService;