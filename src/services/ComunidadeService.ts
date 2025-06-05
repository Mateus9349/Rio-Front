import { IComunidade } from '../interfaces/comunidade.interface';
import api from './api.service';

const ComunidadeService = {
  async listarComunidades(): Promise<IComunidade[]> {
    const response = await api.get('/comunidades');
    return response.data;
  },

  async buscarComunidade(id: string): Promise<IComunidade> {
    const response = await api.get(`/comunidades/${id}`);
    return response.data;
  },

  async criarComunidade(comunidade: IComunidade): Promise<IComunidade> {
    const response = await api.post('/comunidades', comunidade);
    return response.data;
  },

  async atualizarComunidade(id: string, comunidade: Partial<IComunidade>): Promise<IComunidade> {
    const response = await api.put(`/comunidades/${id}`, comunidade);
    return response.data;
  },

  async removerComunidade(id: string): Promise<void> {
    await api.delete(`/comunidades/${id}`);
  },

  async verificarComunidade(nome: string): Promise<{ id: string } | null> {
    try {
      const response = await api.get(`/comunidades/verificar/${nome.trim().toUpperCase()}`);
      return response.data || null;
    } catch {
      return null;
    }
  },
};

export default ComunidadeService;
