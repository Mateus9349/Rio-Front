import { useMemo, useState } from "react";
import CardCliente from "../Cards/CardCliente/CardCliente";
import SomaDeDados from "../SomaDeDados/SomaDeDados";
import ExibirImagem from "../ExibirImagem/ExibirImagem";
import type { ICliente } from "../../interfaces/cliente.interface";
import type { ICertificado } from "../../interfaces/certificado.interface";
import type { IImagemSaf } from "../../interfaces/SAF.interface";
import {
    calcularTotaisCertificadoSafs,
    extrairSafsDoCertificado,
    normalizarCodigoCertificado,
    toImagemSafArray,
} from "../../utils/certificadoSaf";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
    id: string;
    certificados: ICertificado[];
}

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

export default function SectionDetalhesCliente({ id, certificados }: Props) {
    const [anoSelecionado, setAnoSelecionado] = useState<number | "TODOS">("TODOS");
    const codigoCertificado = normalizarCodigoCertificado(id);

    const certificadosDoCodigo = useMemo(() => {
        if (!codigoCertificado) return [];
        return certificados.filter(
            (certificado) => normalizarCodigoCertificado(certificado.codigo) === codigoCertificado
        );
    }, [certificados, codigoCertificado]);

    const clienteComImagem: ICliente | null = useMemo(() => {
        const clientesDoCertificado = certificadosDoCodigo
            .map((certificado) => certificado.cliente)
            .filter((cliente): cliente is ICliente => Boolean(cliente?.id && cliente.nome));

        if (clientesDoCertificado.length === 0) return null;

        return (
            clientesDoCertificado.find(
                (cliente) => cliente.imagem && cliente.imagem.trim() !== ""
            ) ?? clientesDoCertificado[0]
        );
    }, [certificadosDoCodigo]);

    const anosDisponiveis = useMemo(() => {
        const anos = certificadosDoCodigo
            .map((certificado) => certificado.ano)
            .filter((ano): ano is number => typeof ano === "number" && Number.isFinite(ano));
        return Array.from(new Set(anos)).sort((a, b) => b - a);
    }, [certificadosDoCodigo]);

    const certificadosFiltrados = useMemo(() => {
        if (anoSelecionado === "TODOS") return certificadosDoCodigo;
        return certificadosDoCodigo.filter((certificado) => certificado.ano === anoSelecionado);
    }, [certificadosDoCodigo, anoSelecionado]);

    const certificadoSafs = useMemo(
        () => certificadosFiltrados.flatMap((certificado) => extrairSafsDoCertificado(certificado)),
        [certificadosFiltrados]
    );

    const imagensDoCertificado = useMemo(() => {
        const todas: IImagemSaf[] = certificadoSafs.flatMap((certificadoSaf) =>
            toImagemSafArray(certificadoSaf.saf?.imagens)
        );

        const anosValidos = new Set(anosDisponiveis);
        const base =
            anoSelecionado === "TODOS"
                ? todas.filter(
                    (imagem) =>
                        typeof imagem.ano !== "number" ||
                        anosValidos.size === 0 ||
                        anosValidos.has(imagem.ano)
                )
                : todas.filter((imagem) => imagem.ano === anoSelecionado);

        const unicas = uniqByUrl(base);

        unicas.sort((a, b) => {
            const aa = typeof a.ano === "number" ? a.ano : -Infinity;
            const bb = typeof b.ano === "number" ? b.ano : -Infinity;
            return bb - aa;
        });

        return unicas;
    }, [certificadoSafs, anoSelecionado, anosDisponiveis]);

    const totais = useMemo(
        () => calcularTotaisCertificadoSafs(certificadoSafs),
        [certificadoSafs]
    );

    if (!clienteComImagem) {
        return <p>Certificado não encontrado.</p>;
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

            {imagensDoCertificado.length > 0 ? (
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
                        {imagensDoCertificado.map((img) => (
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
