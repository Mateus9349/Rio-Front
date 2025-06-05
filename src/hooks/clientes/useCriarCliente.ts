import { useState } from 'react';
import { ICliente } from '../../interfaces/cliente.interface';
import ClienteService from '../../services/ClienteService';
import { normalizar } from '../../utils/funcoes';

export default function useCriarCliente() {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [clienteCriado, setClienteCriado] = useState<ICliente | null>(null);
    const [clienteJaExiste, setClienteJaExiste] = useState(false);

    const verificarExistencia = async (id: string): Promise<string | null> => {
        try {
            const cliente = await ClienteService.buscarCliente(normalizar(id));
            const existe = !!cliente?.id;
            setClienteJaExiste(existe);
            return cliente?.id || null;
        } catch {
            setClienteJaExiste(false);
            return null;
        }
    };

    const criarCliente = async (dados: ICliente) => {
        setLoading(true);
        setErro(null);
        setClienteCriado(null);

        try {
            const cliente = await ClienteService.criarCliente({
                id: normalizar(dados.id),
                nome: normalizar(dados.nome),
            });
            setClienteCriado(cliente);
        } catch {
            setErro('Erro ao criar o cliente');
        } finally {
            setLoading(false);
        }
    };

    return {
        criarCliente,
        verificarExistencia,
        loading,
        erro,
        clienteCriado,
        clienteJaExiste,
    };
}