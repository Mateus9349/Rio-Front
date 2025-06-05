import { useState } from 'react';
import { IComunidade } from '../../interfaces/comunidade.interface';
import ComunidadeService from '../../services/ComunidadeService';
import { normalizar } from '../../utils/funcoes';

export default function useCriarComunidade() {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [comunidadeCriada, setComunidadeCriada] = useState<IComunidade | null>(null);
    const [comunidadeJaExiste, setComunidadeJaExiste] = useState(false);

    const verificarExistencia = async (nome: string): Promise<string | null> => {
        try {
            const resultado = await ComunidadeService.verificarComunidade(normalizar(nome));
            const existe = !!resultado?.id;
            setComunidadeJaExiste(existe);
            return resultado?.id || null;
        } catch {
            setComunidadeJaExiste(false);
            return null;
        }
    };

    const criarComunidade = async (dados: IComunidade) => {
        setLoading(true);
        setErro(null);
        setComunidadeCriada(null);

        try {
            const nova = await ComunidadeService.criarComunidade({ ...dados, nome: normalizar(dados.nome) });
            setComunidadeCriada(nova);
        } catch {
            setErro('Erro ao criar comunidade');
        } finally {
            setLoading(false);
        }
    };

    return {
        criarComunidade,
        verificarExistencia,
        loading,
        erro,
        comunidadeCriada,
        comunidadeJaExiste,
    };
}
