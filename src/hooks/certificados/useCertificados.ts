import { useCallback, useEffect, useState } from "react";
import CertificadoService from "../../services/certificado.service";
import type {
    ICertificado,
    ICreateCertificadoDto,
    ICreateCertificadoSafDto,
    IUpdateCertificadoDto,
} from "../../interfaces/certificado.interface";
import { getErrorMessage } from "../../utils/errors";

export default function useCertificados() {
    const [certificados, setCertificados] = useState<ICertificado[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const listarCertificados = useCallback(async () => {
        return CertificadoService.listarCertificados();
    }, []);

    const carregarCertificados = useCallback(async () => {
        try {
            setLoading(true);
            const dados = await listarCertificados();
            setCertificados(Array.isArray(dados) ? dados : []);
            setError(null);
            return dados;
        } catch (erro: unknown) {
            const mensagem = getErrorMessage(erro, "Erro ao carregar os certificados.");
            setError(mensagem);
            throw erro;
        } finally {
            setLoading(false);
        }
    }, [listarCertificados]);

    const buscarCertificado = useCallback((id: string) => {
        return CertificadoService.buscarCertificado(id);
    }, []);

    const buscarCertificadoPorCodigo = useCallback((codigo: string) => {
        return CertificadoService.buscarCertificadoPorCodigo(codigo);
    }, []);

    const verificarExistenciaPorCodigoESaf = useCallback((codigo: string, saf: string) => {
        return CertificadoService.verificarExistenciaPorCodigoESaf(codigo, saf);
    }, []);

    const criarCertificado = useCallback(async (payload: ICreateCertificadoDto) => {
        const certificadoCriado = await CertificadoService.criarCertificado(payload);
        carregarCertificados().catch((erro) =>
            console.error("Erro ao recarregar certificados após criação:", erro)
        );
        return certificadoCriado;
    }, [carregarCertificados]);

    const adicionarSafAoCertificado = useCallback(async (
        certificadoId: string,
        payload: ICreateCertificadoSafDto
    ) => {
        const response = await CertificadoService.adicionarSafAoCertificado(certificadoId, payload);
        carregarCertificados().catch((erro) =>
            console.error("Erro ao recarregar certificados após anexar SAF:", erro)
        );
        return response;
    }, [carregarCertificados]);

    const atualizarCertificado = useCallback(async (
        id: string,
        payload: IUpdateCertificadoDto
    ) => {
        const certificadoAtualizado = await CertificadoService.atualizarCertificado(id, payload);
        carregarCertificados().catch((erro) =>
            console.error("Erro ao recarregar certificados após atualização:", erro)
        );
        return certificadoAtualizado;
    }, [carregarCertificados]);

    const removerCertificado = useCallback(async (id: string) => {
        await CertificadoService.removerCertificado(id);
        await carregarCertificados();
    }, [carregarCertificados]);

    useEffect(() => {
        carregarCertificados().catch(() => undefined);
    }, [carregarCertificados]);

    return {
        certificados,
        loadingCertificados: loading,
        errorCertificados: error,
        listarCertificados,
        recarregarCertificados: carregarCertificados,
        buscarCertificado,
        buscarCertificadoPorCodigo,
        verificarExistenciaPorCodigoESaf,
        criarCertificado,
        adicionarSafAoCertificado,
        atualizarCertificado,
        removerCertificado,
    };
}
