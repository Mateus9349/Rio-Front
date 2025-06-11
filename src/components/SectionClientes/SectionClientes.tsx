import { useState } from "react";
import { ICliente } from "../../interfaces/cliente.interface";
import { IPlantioBack } from "../../interfaces/plantioBack.interface";
import CardCliente from "../Cards/CardCliente/CardCliente";

interface Props {
    clientes: ICliente[];
    plantios: IPlantioBack[];
    selecionaCliente?: (id: string) => void;
}

const CLIENTES_POR_PAGINA = 8;

function normalizarNome(nome: string) {
    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/\(.*?\)/g, "")        // Remove textos entre parênteses
        .replace(/[^A-Z]/gi, "")        // Remove tudo que não for letra
        .toUpperCase();
}

export default function SectionClientes({ clientes, selecionaCliente }: Props) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const nomesExibidos = new Set<string>();

    const clientesFiltrados = clientes
        .map((cliente) => {
            const nomeNormalizado = normalizarNome(cliente.nome);
            return { ...cliente, nomeNormalizado };
        })
        .filter((cliente) => {
            if (nomesExibidos.has(cliente.nomeNormalizado)) return false;
            nomesExibidos.add(cliente.nomeNormalizado);
            return true;
        })
        .sort((a, b) => a.nomeNormalizado.localeCompare(b.nomeNormalizado, "pt-BR", { sensitivity: "base" }));

    const totalPaginas = Math.ceil(clientesFiltrados.length / CLIENTES_POR_PAGINA);
    const inicio = (paginaAtual - 1) * CLIENTES_POR_PAGINA;
    const clientesPagina = clientesFiltrados.slice(inicio, inicio + CLIENTES_POR_PAGINA);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {clientesPagina.map((cliente) => (
                    <div key={cliente.id} onClick={() => selecionaCliente?.(cliente.id)}>
                        <CardCliente cliente={cliente} />
                    </div>
                ))}
            </div>

            {totalPaginas > 1 && (
                <div className="flex justify-center gap-4 mt-4 text-sm">
                    <button
                        onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                        disabled={paginaAtual === 1}
                        className={`underline ${paginaAtual === 1 ? "text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                    >
                        Anterior
                    </button>

                    <span className="text-gray-600">
                        Página {paginaAtual} de {totalPaginas}
                    </span>

                    <button
                        onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                        disabled={paginaAtual === totalPaginas}
                        className={`underline ${paginaAtual === totalPaginas ? "text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}
