import { ISAF } from '../interfaces/SAF.interface';
import { normalizar } from '../utils/funcoes';
import api from './api.service';

const SafService = {
  async listarSafs(): Promise<ISAF[]> {
    const response = await api.get('/safs');
    return response.data;
  },

  async buscarSaf(id: string): Promise<ISAF> {
    const response = await api.get(`/safs/${id}`);
    return response.data;
  },

  async criarSaf(saf: ISAF): Promise<ISAF> {
    const response = await api.post('/safs', saf);
    return response.data;
  },

  async atualizarSaf(id: string, saf: Partial<ISAF>): Promise<ISAF> {
    const response = await api.put(`/safs/${id}`, saf);
    return response.data;
  },

  async removerSaf(id: string): Promise<void> {
    await api.delete(`/safs/${id}`);
  },

  async verificarSaf(identificacao: string): Promise<{ id: string } | null> {
    try {
      const normalizado = normalizar(identificacao);
      const response = await api.get(`/safs/verificar/${normalizado}`);
      return response.data || null;
    } catch {
      return null;
    }
  },
};

export default SafService;