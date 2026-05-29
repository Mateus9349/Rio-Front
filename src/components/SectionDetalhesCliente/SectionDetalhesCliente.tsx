import { useMemo, useState } from "react";
import CardCliente from "../Cards/CardCliente/CardCliente";
import SomaDeDados from "../SomaDeDados/SomaDeDados";
import ExibirImagem from "../ExibirImagem/ExibirImagem";
import type { ICliente } from "../../interfaces/cliente.interface";
import type { ICertificado } from "../../interfaces/certificado.interface";
import type { IImagemSaf } from "../../interfaces/SAF.interface";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
    codigo: string;
    certificados: ICertificado[];
    clientes: ICliente[];
}

const normalizarCodigo = (codigo: string) => codigo.trim().toUpperCase();

// Aceita dados de SAF antigos (string[]) e novos ({url, ano}[])
const toImagemSafArray = (v: unknown): IImagemSaf[] => {
    if (!Array.isArray(v)) return [];

    return v.reduce<IImagemSaf[]>((acc, item) => {
        if (typeof item === "string") {
            acc.push({ url: item, ano: undefined });
            return acc;
        }

        if (
            typeof item === "object" &&
            item !== null &&
            "url" in item &&
            typeof item.url === "string"
        ) {
            const ano =
                "ano" in item && typeof item.ano === "number"
                    ? item.ano
                    : undefined;
            acc.push({ url: item.url, ano });
        }

        return acc;
    }, []);
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

const criarClienteDoCertificado = (certificado: ICertificado): ICliente => ({
    id: Number(certificado.cliente.id ?? 0),
    nome: certificado.cliente.nome,
    imagem: certificado.cliente.imagem,
});

export default function SectionDetalhesCliente({ codigo, certificados, clientes }: Props) {
    const [anoSelecionado, setAnoSelecionado] = useState<number | "TODOS">("TODOS");
    const codigoNormalizado = normalizarCodigo(codigo);

    const certificadosDoCodigo = useMemo(() => {
        if (!codigoNormalizado) return [];
        return certificados.filter(
            (certificado) => normalizarCodigo(certificado.codigo) === codigoNormalizado
        );
    }, [certificados, codigoNormalizado]);

    const certificadoReferencia = certificadosDoCodigo[0];

    const clienteComImagem: ICliente | null = useMemo(() => {
        if (!certificadoReferencia) return null;
        const clienteId = certificadoReferencia.cliente.id;
        const clienteCadastrado =
            typeof clienteId === "number" ? clientes.find((cliente) => cliente.id === clienteId) : undefined;
        return clienteCadastrado ?? criarClienteDoCertificado(certificadoReferencia);
    }, [certificadoReferencia, clientes]);

    const anosDisponiveis = useMemo(() => {
        const anos = certificadosDoCodigo
            .map((certificado) => Number(certificado.ano))
            .filter((ano): ano is number => Number.isFinite(ano));
        return Array.from(new Set(anos)).sort((a, b) => b - a);
    }, [certificadosDoCodigo]);

    const certificadosFiltrados = useMemo(() => {
        if (anoSelecionado === "TODOS") return certificadosDoCodigo;
        return certificadosDoCodigo.filter((certificado) => Number(certificado.ano) === anoSelecionado);
    }, [certificadosDoCodigo, anoSelecionado]);

    const totais = useMemo(() => {
        return certificadosFiltrados.reduce(
            (acc, certificado) => ({
                arvores: acc.arvores + (Number(certificado.arvores) || 0),
                carbono: acc.carbono + (Number(certificado.tco2Compensadas) || 0),
                area: acc.area + (Number(certificado.areaM2) || 0),
            }),
            { arvores: 0, carbono: 0, area: 0 }
        );
    }, [certificadosFiltrados]);

    const imagensDoCliente = useMemo(() => {
        const todas = certificadosFiltrados.flatMap((certificado) =>
            toImagemSafArray(certificado.saf?.imagens)
        );

        return uniqByUrl(todas).sort((a, b) => {
            const aa = typeof a.ano === "number" ? a.ano : -Infinity;
            const bb = typeof b.ano === "number" ? b.ano : -Infinity;
            return bb - aa;
        });
    }, [certificadosFiltrados]);

    if (!certificadosDoCodigo.length) {
        return (
            <p className="text-sm text-gray-500">
                Nenhum certificado encontrado para o código informado.
            </p>
        );
    }

    if (!clienteComImagem) {
        return <p>Carregando informações do certificado...</p>;
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
                        ? "Nenhuma imagem encontrada para este certificado."
                        : "Nenhuma imagem encontrada para o ano selecionado."}
                </p>
            )}
        </div>
    );
}
