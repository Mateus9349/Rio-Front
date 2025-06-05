import { ICliente } from '../interfaces/cliente.interface';
import api from './api.service';


const ClienteService = {
  /**
   * Obtém todos os clientes cadastrados.
   */
  async listarClientes(): Promise<ICliente[]> {
    const response = await api.get('/clientes');
    return response.data;
  },

  /**
   * Obtém um cliente específico pelo ID.
   */
  async buscarCliente(id: string): Promise<ICliente | null> {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // não loga, só retorna null
      }
      throw error; // outros erros ainda devem ser tratados
    }
  },

  /**
   * Cria um novo cliente.
   */
  async criarCliente(cliente: ICliente): Promise<ICliente> {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  /**
   * Atualiza os dados de um cliente existente.
   */
  async atualizarCliente(id: string, cliente: Partial<ICliente>): Promise<ICliente> {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  /**
   * Remove um cliente pelo ID.
   */
  async removerCliente(id: string): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};

export default ClienteService;
