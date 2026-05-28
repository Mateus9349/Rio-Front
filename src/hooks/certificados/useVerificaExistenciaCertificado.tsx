import { useCallback, useState } from 'react';
import { getErrorMessage } from '../../utils/errors';
import CertificadoService from '../../services/certificado.service';
import { IVerificarExistenciaCertificadoResponse } from '../../interfaces/certificado.interface';


export function useVerificaExisteCertificado() {
    const [loadingVerificaExistencia, setLoadingVerificaExistencia] =
        useState(false);

    const [erroVerificaExistencia, setErroVerificaExistencia] =
        useState<string | null>(null);

    const verificarExisteCertificado = useCallback(
        async (
            codigo: string,
            saf: string
        ): Promise<IVerificarExistenciaCertificadoResponse | null> => {
            try {
                setLoadingVerificaExistencia(true);
                setErroVerificaExistencia(null);

                const response =
                    await CertificadoService.verificarExistenciaPorCodigoESaf(codigo, saf);

                return response;
            } catch (error: unknown) {
                const mensagem = getErrorMessage(error, 'Erro ao verificar existência do certificado');

                setErroVerificaExistencia(mensagem);
                return null;
            } finally {
                setLoadingVerificaExistencia(false);
            }
        },
        []
    );

    return {
        verificarExisteCertificado,
        loadingVerificaExistencia,
        erroVerificaExistencia,
    };
}