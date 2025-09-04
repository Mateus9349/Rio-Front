import { useState } from "react";
import { ICliente } from "../../interfaces/cliente.interface";
import { IPlantioBack } from "../../interfaces/plantioBack.interface";
import CardCliente from "../Cards/CardCliente/CardCliente";
import styles from './SectionClientes.module.scss';

interface ClienteComAno extends ICliente {
    anoCompensacao: number;
}

interface Props {
    clientes: ICliente[];
    plantios: IPlantioBack[];
    selecionaCliente?: (id: string) => void;
}

const CLIENTES_POR_PAGINA = 9;

function normalizarNome(nome: string) {
    return nome
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\(.*?\)/g, "")
        .replace(/[^A-Z]/gi, "")
        .toUpperCase();
}

export default function SectionClientes({ clientes, plantios, selecionaCliente }: Props) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const nomeParaGrupo = new Map<string, ICliente[]>();
    const clienteAnoMap = new Map<string, number>();

    // Mapear cada cliente com seu nome normalizado
    for (const cliente of clientes) {
        const nomeNorm = normalizarNome(cliente.nome);
        if (!nomeParaGrupo.has(nomeNorm)) nomeParaGrupo.set(nomeNorm, []);
        nomeParaGrupo.get(nomeNorm)!.push(cliente);
    }

    // Determinar o ano de compensação mais recente por grupo
    for (const [nomeNorm, grupo] of nomeParaGrupo.entries()) {
        const ids = grupo.map(c => c.id);
        const anos = plantios
            .filter(p => ids.includes(p.cliente.id))
            .map(p => p.anoCompensacao);
        clienteAnoMap.set(nomeNorm, anos.length ? Math.max(...anos) : 0);
    }

    // Para cada grupo, escolher o cliente com imagem se possível
    const clientesFiltrados: ClienteComAno[] = Array.from(nomeParaGrupo.entries()).map(([nomeNorm, grupo]) => {
        const comImagem = grupo.find(c => !!c.imagem);
        const escolhido = comImagem || grupo[0];
        return {
            ...escolhido,
            anoCompensacao: clienteAnoMap.get(nomeNorm) || 0,
        };
    });

    // Ordenar por ano de compensação (mais recentes primeiro)
    clientesFiltrados.sort((a, b) => b.anoCompensacao - a.anoCompensacao);

    const totalPaginas = Math.ceil(clientesFiltrados.length / CLIENTES_POR_PAGINA);
    const inicio = (paginaAtual - 1) * CLIENTES_POR_PAGINA;
    const clientesPagina = clientesFiltrados.slice(inicio, inicio + CLIENTES_POR_PAGINA);

    return (
        <div className={styles.container}>
            <div className={styles.containerClientes}>
                {clientesPagina.map((cliente) => (
                    <div key={cliente.id} onClick={() => selecionaCliente?.(cliente.id)}>
                        <CardCliente cliente={cliente} />
                    </div>
                ))}
            </div>

            {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4 text-sm">
                    <button
                        onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                        disabled={paginaAtual === 1}
                        className={`px-3 py-1 rounded-md transition 
                            ${paginaAtual === 1
                                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                                : "text-blue-600 hover:text-white hover:bg-blue-600 cursor-pointer"}`}
                    >
                        Anterior
                    </button>

                    <span className="text-gray-600 font-medium">
                        Página {paginaAtual} de {totalPaginas}
                    </span>

                    <button
                        onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                        disabled={paginaAtual === totalPaginas}
                        className={`px-3 py-1 rounded-md transition 
                            ${paginaAtual === totalPaginas
                                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                                : "text-blue-600 hover:text-white hover:bg-blue-600 cursor-pointer"}`}
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}
