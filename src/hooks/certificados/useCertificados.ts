import { useEffect, useState } from "react";
import CertificadoService from "../../services/certificado.service";
import { ICertificado } from "../../interfaces/certificado.interface";

export default function useCertificados() {
    const [certificados, setCertificados] = useState<ICertificado[]>([]);
    const [loadingCertificados, setLoadingCertificados] = useState<boolean>(true);
    const [errorCertificados, setErrorCertificados] = useState<string | null>(null);

    const carregarCertificados = async () => {
        try {
            setLoadingCertificados(true);
            const dados = await CertificadoService.listarCertificados();
            setCertificados(dados);
            setErrorCertificados(null);
        } catch {
            setErrorCertificados("Erro ao carregar os certificados.");
        } finally {
            setLoadingCertificados(false);
        }
    };

    useEffect(() => {
        carregarCertificados();
    }, []);

    return {
        certificados,
        loadingCertificados,
        errorCertificados,
        recarregarCertificados: carregarCertificados,
    };
}
