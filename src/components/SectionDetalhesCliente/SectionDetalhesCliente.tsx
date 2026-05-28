import { useEffect, useMemo, useState } from "react";
import CardCliente from "../Cards/CardCliente/CardCliente";
import ClienteService from "../../services/ClienteService";
import SomaDeDados from "../SomaDeDados/SomaDeDados";
import ExibirImagem from "../ExibirImagem/ExibirImagem";
import type { ICliente } from "../../interfaces/cliente.interface";
import type { IPlantioBack } from "../../interfaces/plantioBack.interface";
import type { IImagemSaf } from "../../interfaces/SAF.interface";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
    id: string;
    plantios: IPlantioBack[];
}

const normalizarTexto = (texto: string) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z]/gi, "")
        .toUpperCase();

// Aceita dados de SAF antigos (string[]) e novos ({url, ano}[])
const toImagemSafArray = (v: unknown): IImagemSaf[] => {
    if (!Array.isArray(v)) return [];
    return v.flatMap((item): IImagemSaf[] => {
        if (typeof item === "string") {
            return [{ url: item }];
        }

        if (typeof item === "object" && item !== null && "url" in item) {
            const imagem = item as IImagemSaf;
            return imagem.url ? [imagem] : [];
        }

        return [];
    });
};

const uniqByUrl = (arr: IImagemSaf[]): IImagemSaf[] => {
    const seen = new Set<string>();
    const out: IImagemSaf[] = [];
    for (const img of arr) {
        if (img?.url && !seen.has(img.url)) {
            seen.add(img.url);
            out.push(img);
        }
    }
    return out;
};

export default function SectionDetalhesCliente({ id, plantios }: Props) {
    const [cliente, setCliente] = useState<ICliente | null>(null);
    const [anoSelecionado, setAnoSelecionado] = useState<number | "TODOS">("TODOS");

    // Busca cliente
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const dados = await ClienteService.buscarCliente(id.toUpperCase());
                if (alive) setCliente(dados);
            } catch (erro) {
                console.error("Erro ao buscar cliente:", erro);
            }
        })();
        return () => {
            alive = false;
        };
    }, [id]);

    const nomeClienteNorm = useMemo(
        () => (cliente ? normalizarTexto(cliente.nome) : ""),
        [cliente]
    );

    // Plantios pertencentes ao cliente
    const plantiosDoCliente = useMemo(() => {
        if (!nomeClienteNorm) return [];
        return plantios.filter((p) => normalizarTexto(p.cliente.nome) === nomeClienteNorm);
    }, [plantios, nomeClienteNorm]);

    // Cliente com imagem (fallback no cliente sem imagem)
    const clienteComImagem: ICliente | null = useMemo(() => {
        if (!cliente) return null;
        const found = plantios
            .map((p) => p.cliente as unknown as ICliente)
            .find(
                (c) =>
                    normalizarTexto(c.nome) === nomeClienteNorm &&
                    c.imagem &&
                    c.imagem.trim() !== ""
            );
        return found || cliente;
    }, [cliente, plantios, nomeClienteNorm]);

    // Anos para filtro (derivados dos plantios do cliente)
    const anosDisponiveis = useMemo(() => {
        const anos = plantiosDoCliente
            .map((p) => p.anoCompensacao)
            .filter((a): a is number => typeof a === "number" && Number.isFinite(a));
        return Array.from(new Set(anos)).sort((a, b) => b - a);
    }, [plantiosDoCliente]);

    // Imagens dos SAFs a partir dos plantios (sem useSafs)
    const imagensDoCliente = useMemo(() => {
        const todas: IImagemSaf[] = plantiosDoCliente.flatMap((p) =>
            toImagemSafArray(p.saf?.imagens)
        );

        const anosValidos = new Set(anosDisponiveis);

        const base =
            anoSelecionado === "TODOS"
                ? todas.filter((i) => typeof i.ano === "number" && anosValidos.has(i.ano))
                : todas.filter((i) => i.ano === anoSelecionado);

        const unicas = uniqByUrl(base);

        unicas.sort((a, b) => {
            const aa = typeof a.ano === "number" ? a.ano : -Infinity;
            const bb = typeof b.ano === "number" ? b.ano : -Infinity;
            return bb - aa;
        });

        return unicas;
    }, [plantiosDoCliente, anoSelecionado, anosDisponiveis]);

    // Totais (seguem o filtro de ano dos plantios)
    const plantiosFiltrados = useMemo(() => {
        if (anoSelecionado === "TODOS") return plantiosDoCliente;
        return plantiosDoCliente.filter((p) => p.anoCompensacao === anoSelecionado);
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
        <div className="space-y-4 flex flex-col items-center w-full">
            <CardCliente cliente={clienteComImagem} />

            {anosDisponiveis.length > 0 && (
                <select
                    className="border p-2 rounded w-full mb-2 cursor-pointer"
                    value={anoSelecionado}
                    onChange={(e) =>
                        setAnoSelecionado(
                            e.target.value === "TODOS" ? "TODOS" : Number(e.target.value)
                        )
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

            {/* Carrossel de imagens filtradas por ano (direto dos plantios) */}
            {imagensDoCliente.length > 0 ? (
                <div className="w-full">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={12}
                        slidesPerView={1.2}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 2.2 },
                            1024: { slidesPerView: 3.2 },
                        }}
                        className="!px-1"
                    >
                        {imagensDoCliente.map((img) => (
                            <SwiperSlide key={img.url}>
                                <figure className="flex flex-col gap-1">
                                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                                        <ExibirImagem
                                            src={img.url}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <figcaption className="text-xs text-gray-600 text-center mt-1">
                                        {typeof img.ano === "number" ? img.ano : "—"}
                                    </figcaption>
                                </figure>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <p className="text-sm text-gray-500">
                    {anoSelecionado === "TODOS"
                        ? "Nenhuma imagem encontrada para este cliente."
                        : "Nenhuma imagem encontrada para o ano selecionado."}
                </p>
            )}
        </div>
    );
}