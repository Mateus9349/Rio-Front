import { useState } from 'react';
import { getErrorMessage } from '../../utils/errors';
import CertificadoService from '../../services/certificado.service';
import {
    ICertificado,
    ICreateCertificadoDto,
} from '../../interfaces/certificado.interface';

export default function useCreateCertificado() {
    const [loadingCreateCertificado, setLoadingCreateCertificado] =
        useState(false);
    const [errorCreateCertificado, setErrorCreateCertificado] =
        useState<string | null>(null);
    const [certificadoCriado, setCertificadoCriado] =
        useState<ICertificado | null>(null);

    const criarCertificado = async (
        payload: ICreateCertificadoDto
    ): Promise<ICertificado> => {
        try {
            setLoadingCreateCertificado(true);
            setErrorCreateCertificado(null);

            console.log("Payload enviado para criar certificado:", payload);
            const response = await CertificadoService.criarCertificado(payload);
            console.log("Resposta da criação do certificado:", response);

            setCertificadoCriado(response);
            return response;
        } catch (error: unknown) {
            const mensagem = getErrorMessage(error, 'Erro ao criar certificado.');

            setErrorCreateCertificado(
                Array.isArray(mensagem) ? mensagem.join(', ') : mensagem
            );

            setCertificadoCriado(null);
            throw error;
        } finally {
            setLoadingCreateCertificado(false);
        }
    };

    const resetCreateCertificado = () => {
        setErrorCreateCertificado(null);
        setCertificadoCriado(null);
        setLoadingCreateCertificado(false);
    };

    return {
        criarCertificado,
        loadingCreateCertificado,
        errorCreateCertificado,
        certificadoCriado,
        resetCreateCertificado,
    };
}