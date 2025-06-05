import { IPlantio } from '../interfaces/plantio.interface';
import { IPlantioBack } from '../interfaces/plantioBack.interface';
import api from './api.service';

const PlantioService = {
  /**
   * Obtém todos os plantios cadastrados.
   */
  async listarPlantios(): Promise<IPlantioBack[]> {
    const response = await api.get('/plantios');
    return response.data;
  },

  /**
   * Obtém um plantio específico pelo ID.
   */
  async buscarPlantio(id: string): Promise<IPlantio> {
    const response = await api.get(`/plantios/${id}`);
    return response.data;
  },

  /**
   * Verifica se um plantio já existe com os mesmos dados.
   */
  async verificarPlantioExistente(novoPlantio: Partial<IPlantio>): Promise<boolean> {
    const response = await api.get('/plantios');
    const plantios = response.data as IPlantio[];

    return plantios.some(plantio =>
      plantio.clienteId === novoPlantio.clienteId &&
      plantio.safId === novoPlantio.safId &&
      plantio.comunidadeId === novoPlantio.comunidadeId &&
      plantio.proprietarioId === novoPlantio.proprietarioId &&
      plantio.anoCompensacao === novoPlantio.anoCompensacao
    );
  },

  /**
   * Cria um novo plantio.
   */
  async criarPlantio(plantio: IPlantio): Promise<IPlantio> {
    const response = await api.post('/plantios', plantio);
    return response.data;
  },

  /**
   * Atualiza os dados de um plantio existente.
   */
  async atualizarPlantio(id: string, plantio: Partial<IPlantio>): Promise<IPlantio> {
    const response = await api.put(`/plantios/${id}`, plantio);
    return response.data;
  },

  /**
   * Remove um plantio pelo ID.
   */
  async removerPlantio(id: string): Promise<void> {
    await api.delete(`/plantios/${id}`);
  },

  async verificarPlantioRemoto(plantio: IPlantio): Promise<boolean> {
    const response = await api.post("/plantios/verificar", plantio);
    return response.data.existe === true;
  }
};

export default PlantioService;
