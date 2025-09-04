import { useEffect, useState, useMemo } from "react";
import { ICliente } from "../../interfaces/cliente.interface";
import { IPlantioBack } from "../../interfaces/plantioBack.interface";
import CardCliente from "../Cards/CardCliente/CardCliente";
import ClienteService from "../../services/ClienteService";
import SomaDeDados from "../SomaDeDados/SomaDeDados";

interface Props {
    id: string;
    plantios: IPlantioBack[];
}

function normalizarTexto(texto: string) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[^A-Z]/gi, "") // remove espaços, números e pontuações
        .toUpperCase();
}

export default function SectionDetalhesCliente({ id, plantios }: Props) {
    const [cliente, setCliente] = useState<ICliente | null>(null);
    const [anoSelecionado, setAnoSelecionado] = useState<number | "TODOS">("TODOS");

    useEffect(() => {
        async function fetchCliente() {
            try {
                const dados = await ClienteService.buscarCliente(id.toUpperCase());
                setCliente(dados);
            } catch (erro) {
                console.error("Erro ao buscar cliente:", erro);
            }
        }

        fetchCliente();
    }, [id]);

    const plantiosDoCliente = useMemo(() => {
        if (!cliente) return [];

        const nomeCliente = normalizarTexto(cliente.nome);

        return plantios.filter((p) => {
            const nomePlantio = normalizarTexto(p.cliente.nome);
            return nomePlantio === nomeCliente;
        });
    }, [cliente, plantios]);

    const clienteComImagem: ICliente | null = useMemo(() => {
        if (!cliente) return null;

        const nomeCliente = normalizarTexto(cliente.nome);

        const clienteImagemValida = plantios
            .map(p => p.cliente as ICliente)
            .find(c =>
                normalizarTexto(c.nome) === nomeCliente &&
                c.imagem &&
                c.imagem.trim() !== ""
            );

        return clienteImagemValida || cliente;
    }, [cliente, plantios]);

    const anosDisponiveis = useMemo(() => {
        const anos = plantiosDoCliente
            .map(p => p.anoCompensacao)
            .filter((ano, i, self) => self.indexOf(ano) === i)
            .sort((a, b) => b - a); // do mais novo ao mais antigo

        return anos;
    }, [plantiosDoCliente]);

    const plantiosFiltrados = useMemo(() => {
        if (anoSelecionado === "TODOS") return plantiosDoCliente;
        return plantiosDoCliente.filter(p => p.anoCompensacao === anoSelecionado);
    }, [plantiosDoCliente, anoSelecionado]);

    const totais = useMemo(() => {
        return plantiosFiltrados.reduce(
            (acc, p) => {
                const arvores = p.numeroArvores || 0;
                const carbono = Number(p.tCO2Compensadas) || 0;
                const areaM2 = Number(p.areaM2) || 0;
                const areaHa = areaM2 / 10000;

                return {
                    arvores: acc.arvores + arvores,
                    carbono: acc.carbono + carbono,
                    area: acc.area + areaHa,
                };
            },
            { arvores: 0, carbono: 0, area: 0 }
        );
    }, [plantiosFiltrados]);

    if (!clienteComImagem) {
        return <p>Carregando informações do cliente...</p>;
    }

    return (
        <div className="space-y-4 flex flex-col items-center">
            <CardCliente cliente={clienteComImagem} />

            {anosDisponiveis.length > 0 && (
                <select
                    className="border p-2 rounded w-full mb-2 cursor-pointer"
                    value={anoSelecionado}
                    onChange={(e) =>
                        setAnoSelecionado(e.target.value === "TODOS" ? "TODOS" : Number(e.target.value))
                    }
                >
                    <option value="TODOS">Todos os anos</option>
                    {anosDisponiveis.map((ano) => (
                        <option key={ano} value={ano}>
                            {ano}
                        </option>
                    ))}
                </select>
            )}

            <SomaDeDados totais={totais} />
        </div>
    );
}
