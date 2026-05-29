import { useMemo } from "react";
import ExibirImagem from "../ExibirImagem/ExibirImagem";
import type { IImagemSaf, ISAF } from "../../interfaces/SAF.interface";
import type { ICertificado } from "../../interfaces/certificado.interface";
import { removerEntreParenteses } from "../../utils/funcoes";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Tupla [rótulo do ano, lista de imagens daquele ano]
export type ImagensPorAno = Array<[anoLabel: string, lista: IImagemSaf[]]>;

export type InfoSafMapaProps = {
    selectedSaf?: ISAF | null;
    certificados: ICertificado[];
    imagensPorAno: ImagensPorAno;
    className?: string;
};

const mesmoSaf = (certificado: ICertificado, selectedSaf: ISAF) => {
    if (selectedSaf.id && certificado.saf?.id) {
        return certificado.saf.id === selectedSaf.id;
    }

    return certificado.saf?.identificacao === selectedSaf.identificacao;
};

export default function InfoSafMapa({
    selectedSaf,
    certificados,
    imagensPorAno,
    className,
}: InfoSafMapaProps) {
    const certificadosDoSaf = useMemo(() => {
        if (!selectedSaf) return [];
        return certificados.filter((certificado) => mesmoSaf(certificado, selectedSaf));
    }, [certificados, selectedSaf]);

    const totalArvoresNoSaf = useMemo(() => {
        return certificadosDoSaf.reduce(
            (sum, certificado) => sum + (Number(certificado.arvores) || 0),
            0
        );
    }, [certificadosDoSaf]);

    const proprietarios = useMemo(() => {
        const map = new Map<
            string,
            { id: string; nome: string; telefone?: string; email?: string }
        >();

        for (const certificado of certificadosDoSaf) {
            const proprietario = certificado.proprietario;
            const chave = proprietario?.id || proprietario?.nome;

            if (chave && proprietario?.nome && !map.has(chave)) {
                map.set(chave, {
                    id: proprietario.id || chave,
                    nome: proprietario.nome,
                    telefone: proprietario.telefone,
                    email: proprietario.email,
                });
            }
        }

        return Array.from(map.values());
    }, [certificadosDoSaf]);

    const proprietarioLabel = useMemo(() => {
        if (proprietarios.length === 0) return "—";
        if (proprietarios.length === 1) return proprietarios[0].nome;
        return proprietarios.map((p) => p.nome).join(", ");
    }, [proprietarios]);

    return (
        <div className={`mt-4 space-y-6 ${className ?? ""}`}>
            <h1>
                Informações do {selectedSaf?.identificacao ?? "SAF"}
            </h1>

            <div className="rounded border bg-white/50 p-3 flex flex-wrap items-center gap-4 text-sm">
                <div>
                    <span className="text-gray-600">Proprietário(a): </span>
                    <span className="font-medium">{removerEntreParenteses(proprietarioLabel)}</span>
                    {proprietarios.length > 1 && (
                        <span className="text-gray-500"> ({proprietarios.length})</span>
                    )}
                </div>
                <div className="h-4 w-px bg-gray-200 hidden sm:block" />
                <div>
                    <span className="text-gray-600">Árvores no SAF: </span>
                    <span className="font-medium">
                        {totalArvoresNoSaf.toLocaleString("pt-BR")}
                    </span>
                </div>
                {certificadosDoSaf.length > 0 && (
                    <>
                        <div className="h-4 w-px bg-gray-200 hidden sm:block" />
                        <div className="text-gray-600">
                            Certificados vinculados:{" "}
                            <span className="font-medium">{certificadosDoSaf.length}</span>
                        </div>
                    </>
                )}
            </div>

            {imagensPorAno.map(([anoLabel, lista]) => (
                <section key={anoLabel}>
                    <div className="flex items-center gap-3 my-2">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs font-medium uppercase text-gray-600">
                            {anoLabel}
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

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
                        {lista.map((img: IImagemSaf) => (
                            <SwiperSlide key={`${img.url}-${img.ano ?? "na"}`}>
                                <figure className="flex flex-col gap-1">
                                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                                        <ExibirImagem
                                            src={img.url}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </figure>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
            ))}
        </div>
    );
}
