import { ISAF, IImagemSaf } from '../interfaces/SAF.interface';
import { normalizar } from '../utils/funcoes';
import api from './api.service';

const SafService = {
  // ---------- CRUD ----------
  async listarSafs(): Promise<ISAF[]> {
    const { data } = await api.get('/safs');
    return data;
  },

  async buscarSaf(id: string): Promise<ISAF> {
    const { data } = await api.get(`/safs/${id}`);
    return data;
  },

  async criarSaf(saf: Omit<ISAF, 'id'>): Promise<ISAF> {
    const { data } = await api.post('/safs', saf);
    return data;
  },

  async atualizarSaf(id: string, saf: Partial<ISAF>): Promise<ISAF> {
    const { data } = await api.put(`/safs/${id}`, saf);
    return data;
  },

  async removerSaf(id: string): Promise<void> {
    await api.delete(`/safs/${id}`);
  },

  async verificarSaf(identificacao: string): Promise<{ id: string } | null> {
    try {
      const normalizado = normalizar(identificacao);
      const { data } = await api.get(`/safs/verificar/${encodeURIComponent(normalizado)}`);
      return data || null;
    } catch {
      return null;
    }
  },

  // ---------- Imagens { url, ano } ----------
  /**
   * Adiciona UMA imagem ao SAF (url + ano).
   * Backend: POST /safs/:id/imagens  body: { url, ano }
   */
  async adicionarImagem(safId: string, imagem: IImagemSaf): Promise<ISAF> {
    const { data } = await api.post(`/safs/${safId}/imagens`, imagem);
    return data;
  },

  /**
   * Remove UMA imagem pela URL.
   * Backend: DELETE /safs/:id/imagens?url=...
   */
  async removerImagem(safId: string, url: string): Promise<ISAF> {
    const { data } = await api.delete(`/safs/${safId}/imagens`, { params: { url } });
    return data;
  },

  /**
   * Opcional: substitui TODAS as imagens de uma vez (usa PUT /safs/:id).
   * Útil para reordenação ou sync completo.
   */
  async setImagens(safId: string, imagens: IImagemSaf[]): Promise<ISAF> {
    const { data } = await api.put(`/safs/${safId}`, { imagens });
    return data;
  },
};

export default SafService;
