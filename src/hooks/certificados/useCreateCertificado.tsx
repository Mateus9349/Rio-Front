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
    ): Promise<ICertificado | null> => {
        try {
            setLoadingCreateCertificado(true);
            setErrorCreateCertificado(null);

            const response = await CertificadoService.criarCertificado(payload);

            setCertificadoCriado(response);
            return response;
        } catch (error: unknown) {
            const mensagem = getErrorMessage(error, 'Erro ao criar certificado.');

            setErrorCreateCertificado(
                Array.isArray(mensagem) ? mensagem.join(', ') : mensagem
            );

            setCertificadoCriado(null);
            return null;
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