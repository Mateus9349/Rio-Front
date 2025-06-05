import { useState } from 'react';
import { ISAF } from '../../interfaces/SAF.interface';
import SafService from '../../services/SafService';

export default function useCriarSaf() {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [safCriado, setSafCriado] = useState<ISAF | null>(null);
    const [safJaExiste, setSafJaExiste] = useState(false);

    const verificarExistencia = async (identificacao: string): Promise<string | null> => {
        try {
            const existente = await SafService.verificarSaf(identificacao);
            const existe = !!existente?.id;
            setSafJaExiste(existe);
            return existente?.id || null;
        } catch {
            setSafJaExiste(false);
            return null;
        }
    };

    const criarSaf = async (dados: ISAF) => {
        setLoading(true);
        setErro(null);
        setSafCriado(null);

        try {
            const novoSaf = await SafService.criarSaf(dados);
            setSafCriado(novoSaf);
        } catch {
            setErro('Erro ao criar SAF');
        } finally {
            setLoading(false);
        }
    };

    return {
        criarSaf,
        verificarExistencia,
        loading,
        erro,
        safCriado,
        safJaExiste,
    };
}