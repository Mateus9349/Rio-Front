import { useState } from "react";
import { ICliente } from "../../interfaces/cliente.interface";
import ClienteService from "../../services/ClienteService";

export default function useAtualizarCliente() {
    const [loadingAtualizar, setLoadingAtualizar] = useState(false);
    const [erroAtualizar, setErroAtualizar] = useState<Error | null>(null);

    const atualizarCliente = async (id: string, dados: Partial<ICliente>): Promise<ICliente | null> => {
        setLoadingAtualizar(true);
        setErroAtualizar(null);

        try {
            const clienteAtualizado = await ClienteService.atualizarCliente(id, dados);
            return clienteAtualizado;
        } catch (erro: any) {
            setErroAtualizar(erro);
            return null;
        } finally {
            setLoadingAtualizar(false);
        }
    };

    return {
        atualizarCliente,
        loadingAtualizar,
        erroAtualizar,
    };
}
