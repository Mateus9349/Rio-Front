import { useEffect, useMemo, useState } from "react";
import { ICliente } from "../../interfaces/cliente.interface";
import { ICertificado } from "../../interfaces/certificado.interface";
import CardCliente from "../Cards/CardCliente/CardCliente";
import styles from './SectionClientes.module.scss';

interface ClienteComCertificado extends ICliente {
    anoCertificado: number;
    codigoCertificado: string;
}

interface Props {
    clientes: ICliente[];
    certificados: ICertificado[];
    selecionaCertificado?: (codigo: string) => void;
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

const criarClienteDoCertificado = (certificado: ICertificado): ICliente => ({
    id: Number(certificado.cliente.id ?? 0),
    nome: certificado.cliente.nome,
    imagem: certificado.cliente.imagem,
});

export default function SectionClientes({ clientes, certificados, selecionaCertificado }: Props) {
    const [paginaAtual, setPaginaAtual] = useState(1);

    const clientesFiltrados = useMemo<ClienteComCertificado[]>(() => {
        const clientesPorId = new Map(clientes.map((cliente) => [cliente.id, cliente]));
        const grupos = new Map<string, ICertificado[]>();

        for (const certificado of certificados) {
            const nomeNorm = normalizarNome(certificado.cliente.nome);
            if (!nomeNorm) continue;
            if (!grupos.has(nomeNorm)) grupos.set(nomeNorm, []);
            grupos.get(nomeNorm)!.push(certificado);
        }

        return Array.from(grupos.values())
            .map((certificadosDoCliente) => {
                const certificadosOrdenados = [...certificadosDoCliente].sort(
                    (a, b) => (Number(b.ano) || 0) - (Number(a.ano) || 0)
                );
                const certificadoMaisRecente = certificadosOrdenados[0];
                const clienteId = certificadoMaisRecente.cliente.id;
                const clienteCadastrado =
                    typeof clienteId === "number" ? clientesPorId.get(clienteId) : undefined;
                const cliente = clienteCadastrado ?? criarClienteDoCertificado(certificadoMaisRecente);

                return {
                    ...cliente,
                    anoCertificado: Number(certificadoMaisRecente.ano) || 0,
                    codigoCertificado: certificadoMaisRecente.codigo,
                };
            })
            .sort((a, b) => b.anoCertificado - a.anoCertificado || a.nome.localeCompare(b.nome));
    }, [clientes, certificados]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [certificados.length, clientes.length]);

    const totalPaginas = Math.ceil(clientesFiltrados.length / CLIENTES_POR_PAGINA);
    const inicio = (paginaAtual - 1) * CLIENTES_POR_PAGINA;
    const clientesPagina = clientesFiltrados.slice(inicio, inicio + CLIENTES_POR_PAGINA);

    if (!clientesFiltrados.length) {
        return <p className="text-sm text-gray-500">Nenhum certificado encontrado.</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.containerClientes}>
                {clientesPagina.map((cliente) => (
                    <div
                        key={`${cliente.codigoCertificado}-${cliente.id}-${cliente.nome}`}
                        onClick={() => selecionaCertificado?.(cliente.codigoCertificado)}
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
