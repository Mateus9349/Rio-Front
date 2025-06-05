import { IProprietario } from '../interfaces/proprietario.interface';
import api from './api.service';

const ProprietarioService = {
  async listarProprietarios(): Promise<IProprietario[]> {
    const response = await api.get('/proprietarios');
    return response.data;
  },

  async buscarProprietario(id: string): Promise<IProprietario> {
    const response = await api.get(`/proprietarios/${id}`);
    return response.data;
  },

  async criarProprietario(proprietario: IProprietario): Promise<IProprietario> {
    const response = await api.post('/proprietarios', {
      nome: proprietario.nome.toUpperCase().trim(), // garante consistência
    });
    return response.data;
  },

  async atualizarProprietario(id: string, proprietario: Partial<IProprietario>): Promise<IProprietario> {
    const response = await api.put(`/proprietarios/${id}`, proprietario);
    return response.data;
  },

  async removerProprietario(id: string): Promise<void> {
    await api.delete(`/proprietarios/${id}`);
  },

  async verificarProprietarioPorNome(nome: string): Promise<IProprietario | null> {
    try {
      const response = await api.get(`/proprietarios/verificar/${nome.trim().toUpperCase()}`);
      return response.data;
    } catch {
      return null;
    }
  },
};

export default ProprietarioService;
