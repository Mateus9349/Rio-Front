import { useCallback, useState } from 'react';
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
            } catch (error: any) {
                const mensagem =
                    error?.response?.data?.message ||
                    error?.message ||
                    'Erro ao verificar existência do certificado';

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