import { useState } from "react";
import { ICliente } from "../../interfaces/cliente.interface";
import type { ICertificado } from "../../interfaces/certificado.interface";
import CardCliente from "../Cards/CardCliente/CardCliente";
import styles from "./SectionClientes.module.scss";

interface ClienteComAno extends ICliente {
    ano: number;
    codigoCertificado?: string;
}

interface Props {
    clientes: ICliente[];
    certificados: ICertificado[];
    selecionaCliente?: (codigoCertificado: string) => void;
}

const CLIENTES_POR_PAGINA = 9;

function normalizarNome(nome: string) {
    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\(.*?\)/g, "")
        .replace(/[^A-Z]/gi, "")
        .toUpperCase();
}

function certificadoMaisRecente(certificados: ICertificado[]) {
    return [...certificados]
        .filter((certificado) => certificado.codigo)
        .sort((a, b) => (b.ano || 0) - (a.ano || 0))[0];
}

export default function SectionClientes({ clientes, certificados, selecionaCliente }: Props) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const nomeParaGrupo = new Map<string, ICliente[]>();
    const certificadosPorCliente = new Map<string, ICertificado[]>();

    for (const cliente of clientes) {
        const nomeNorm = normalizarNome(cliente.nome);
        if (!nomeParaGrupo.has(nomeNorm)) nomeParaGrupo.set(nomeNorm, []);
        nomeParaGrupo.get(nomeNorm)!.push(cliente);
    }

    for (const certificado of certificados) {
        if (!certificado.cliente?.id) continue;
        const clienteId = String(certificado.cliente.id);
        if (!certificadosPorCliente.has(clienteId)) certificadosPorCliente.set(clienteId, []);
        certificadosPorCliente.get(clienteId)!.push(certificado);
    }

    const clientesFiltrados: ClienteComAno[] = Array.from(nomeParaGrupo.values()).map((grupo) => {
        const certificadosDoGrupo = grupo.flatMap(
            (cliente) => certificadosPorCliente.get(String(cliente.id)) ?? []
        );
        const certificadoRecente = certificadoMaisRecente(certificadosDoGrupo);
        const comImagem = grupo.find((cliente) => !!cliente.imagem);
        const escolhido = comImagem || grupo[0];

        return {
            ...escolhido,
            ano: certificadoRecente?.ano || 0,
            codigoCertificado: certificadoRecente?.codigo,
        };
    });

    clientesFiltrados.sort((a, b) => b.ano - a.ano);

    const totalPaginas = Math.ceil(clientesFiltrados.length / CLIENTES_POR_PAGINA);
    const inicio = (paginaAtual - 1) * CLIENTES_POR_PAGINA;
    const clientesPagina = clientesFiltrados.slice(inicio, inicio + CLIENTES_POR_PAGINA);

    return (
        <div className={styles.container}>
            <div className={styles.containerClientes}>
                {clientesPagina.map((cliente) => (
                    <div
                        key={cliente.id}
                        onClick={() => {
                            if (cliente.codigoCertificado) {
                                selecionaCliente?.(cliente.codigoCertificado);
                            }
                        }}
                    >
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
