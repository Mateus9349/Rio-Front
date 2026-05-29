import { useEffect, useState } from "react";
import CertificadoService from "../../services/certificado.service";
import type { ICertificado } from "../../interfaces/certificado.interface";

export default function useCertificados() {
    const [certificados, setCertificados] = useState<ICertificado[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const carregarCertificados = async () => {
        try {
            setLoading(true);
            const dados = await CertificadoService.listarCertificados();
            setCertificados(Array.isArray(dados) ? dados : []);
            setError(null);
        } catch {
            setError("Erro ao carregar os certificados.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarCertificados();
    }, []);

    return {
        certificados,
        loadingCertificados: loading,
        errorCertificados: error,
        recarregarCertificados: carregarCertificados,
    };
}
