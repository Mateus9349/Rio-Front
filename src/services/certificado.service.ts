import api from './api.service';
import { getErrorStatus } from '../utils/errors';
import {
    ICertificado,
    ICreateCertificadoDto,
    IUpdateCertificadoDto,
    IVerificarExistenciaCertificadoResponse,
} from '../interfaces/certificado.interface';

const BASE_URL = '/certificados';

const CertificadoService = {
    /**
     * Lista todos os certificados.
     */
    async listarCertificados(): Promise<ICertificado[]> {
        const response = await api.get<ICertificado[]>(BASE_URL);
        return response.data;
    },

    /**
     * Busca um certificado pelo ID.
     */
    async buscarCertificado(id: string): Promise<ICertificado | null> {
        try {
            const response = await api.get<ICertificado>(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (getErrorStatus(error) === 404) {
                return null;
            }
            throw error;
        }
    },

    /**
     * Busca um certificado pelo código.
     */
    async buscarCertificadoPorCodigo(codigo: string): Promise<ICertificado | null> {
        try {
            const response = await api.get<ICertificado>(
                `${BASE_URL}/codigo/${encodeURIComponent(codigo)}`
            );
            return response.data;
        } catch (error: unknown) {
            if (getErrorStatus(error) === 404) {
                return null;
            }
            throw error;
        }
    },

    async verificarExistenciaPorCodigoESaf(
        codigo: string,
        saf: string
    ): Promise<IVerificarExistenciaCertificadoResponse> {
        const response = await api.get<IVerificarExistenciaCertificadoResponse>(
            `${BASE_URL}/existe`,
            {
                params: {
                    codigo,
                    saf, // aqui é a identificacao da SAF (ex: "2024")
                },
            }
        );

        return response.data;
    },

    /**
     * Cria um novo certificado.
     */
    async criarCertificado(
        payload: ICreateCertificadoDto
    ): Promise<ICertificado> {
        const response = await api.post<ICertificado>(BASE_URL, payload);
        return response.data;
    },

    /**
     * Atualiza parcialmente um certificado existente.
     */
    async atualizarCertificado(
        id: string,
        payload: IUpdateCertificadoDto
    ): Promise<ICertificado> {
        const response = await api.patch<ICertificado>(
            `${BASE_URL}/${id}`,
            payload
        );
        return response.data;
    },

    /**
     * Remove um certificado pelo ID.
     */
    async removerCertificado(id: string): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};

export default CertificadoService;