import { useState } from 'react';
import { IProprietario } from '../../interfaces/proprietario.interface';
import ProprietarioService from '../../services/ProprietarioService';
import { normalizar } from '../../utils/funcoes';

export default function useCriarProprietario() {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [proprietarioCriado, setProprietarioCriado] = useState<IProprietario | null>(null);
    const [proprietarioJaExiste, setProprietarioJaExiste] = useState(false);

    const verificarExistencia = async (nome: string): Promise<string | null> => {
        try {
            const resultado = await ProprietarioService.verificarProprietarioPorNome(normalizar(nome));
            const existe = !!resultado?.id;
            setProprietarioJaExiste(existe);
            return resultado?.id || null;
        } catch {
            setProprietarioJaExiste(false);
            return null;
        }
    };

    const criarProprietario = async (dados: IProprietario) => {
        setLoading(true);
        setErro(null);
        setProprietarioCriado(null);

        try {
            const novo = await ProprietarioService.criarProprietario({ ...dados, nome: normalizar(dados.nome) });
            setProprietarioCriado(novo);
        } catch {
            setErro('Erro ao criar proprietário');
        } finally {
            setLoading(false);
        }
    };

    return {
        criarProprietario,
        verificarExistencia,
        loading,
        erro,
        proprietarioCriado,
        proprietarioJaExiste,
    };
}
