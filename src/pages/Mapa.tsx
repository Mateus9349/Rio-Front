import styles from '../styles/Mapa.module.scss';
import { useMemo, useState } from 'react';
import useCertificados from '../hooks/certificados/useCertificados';
import { useClientes } from '../hooks/clientes/useClientes';
import { ICertificado } from '../interfaces/certificado.interface';
import { ISAF, IImagemSaf } from '../interfaces/SAF.interface';
import { MapaSAFs } from '../components/MapaSAFs/MapaSAFs';
import SectionClientes from '../components/SectionClientes/SectionClientes';
import SomaDeDados from '../components/SomaDeDados/SomaDeDados';
import SectionDetalhesCliente from '../components/SectionDetalhesCliente/SectionDetalhesCliente';
import imagemIdesam from '../assets/img/CO2.png';
import InfoSafMapa from '../components/InfoSafMapa/InfoSafMapa';

function toImagemSafArray(v: unknown): IImagemSaf[] {
    if (!Array.isArray(v)) return [];

    return v.reduce<IImagemSaf[]>((acc, item) => {
        if (typeof item === 'string') {
            acc.push({ url: item, ano: undefined });
            return acc;
        }

        if (
            typeof item === 'object' &&
            item !== null &&
            'url' in item &&
            typeof item.url === 'string'
        ) {
            const ano =
                'ano' in item && typeof item.ano === 'number'
                    ? item.ano
                    : undefined;
            acc.push({ url: item.url, ano });
        }

        return acc;
    }, []);
}

function normalizarCodigo(codigo: string) {
    return codigo.trim().toUpperCase();
}

function coordenadasDoCertificado(certificado: ICertificado) {
    const latitude = Number(
        certificado.saf?.localizacao?.latitude ?? certificado.saf?.latitude ?? 0
    );
    const longitude = Number(
        certificado.saf?.localizacao?.longitude ?? certificado.saf?.longitude ?? 0
    );

    return { latitude, longitude };
}

export default function Mapa() {
    const { certificados, loadingCertificados, errorCertificados } = useCertificados();
    const { clientes, loadingClientes } = useClientes();
    const [codigoCertificado, setCodigoCertificado] = useState('');
    const [imagens, setImagens] = useState<IImagemSaf[]>([]);
    const [selectedSaf, setSelectedSaf] = useState<ISAF>();

    const codigoCertificadoUpper = normalizarCodigo(codigoCertificado);

    const certificadosAtivos = useMemo(
        () => certificados.filter((certificado) => certificado.ativo !== false),
        [certificados]
    );

    const certificadosFiltrados = useMemo(() => {
        if (!codigoCertificadoUpper) return certificadosAtivos;
        return certificadosAtivos.filter(
            (certificado) => normalizarCodigo(certificado.codigo) === codigoCertificadoUpper
        );
    }, [certificadosAtivos, codigoCertificadoUpper]);

    const safs: ISAF[] = useMemo(() => {
        const porSaf = new Map<string, ISAF>();

        for (const certificado of certificadosFiltrados) {
            const { latitude, longitude } = coordenadasDoCertificado(certificado);
            const identificacao = certificado.saf?.identificacao;

            if (!identificacao || Number.isNaN(latitude) || Number.isNaN(longitude) || latitude === 0 || longitude === 0) {
                continue;
            }

            const chave = certificado.saf?.id ?? identificacao;
            const imagensSaf = toImagemSafArray(certificado.saf?.imagens);
            const safExistente = porSaf.get(chave);

            if (safExistente) {
                const urls = new Set((safExistente.imagens ?? []).map((imagem) => imagem.url));
                safExistente.imagens = [
                    ...(safExistente.imagens ?? []),
                    ...imagensSaf.filter((imagem) => !urls.has(imagem.url)),
                ];
                continue;
            }

            porSaf.set(chave, {
                id: certificado.saf?.id ?? chave,
                identificacao,
                latitude,
                longitude,
                imagens: imagensSaf,
            });
        }

        return Array.from(porSaf.values());
    }, [certificadosFiltrados]);

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

    const mostraImagens = (saf: ISAF) => {
        setImagens(toImagemSafArray(saf.imagens));
        setSelectedSaf(saf);
    };

    const imagensPorAno = useMemo(() => {
        const map = new Map<string, IImagemSaf[]>();
        for (const img of imagens) {
            const key =
                typeof img.ano === 'number' && Number.isFinite(img.ano)
                    ? String(img.ano)
                    : 'Sem ano';
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(img);
        }
        return Array.from(map.entries()).sort(([a], [b]) => {
            const na = Number(a), nb = Number(b);
            const aNum = Number.isFinite(na), bNum = Number.isFinite(nb);
            if (aNum && bNum) return nb - na;
            if (aNum) return -1;
            if (bNum) return 1;
            return a.localeCompare(b);
        });
    }, [imagens]);

    return (
        <section className="space-y-6 p-12">
            <div className={styles.container}>
                <input
                    type="text"
                    placeholder="Insira o código informado no seu certificado"
                    value={codigoCertificado}
                    onChange={(e) => setCodigoCertificado(e.target.value)}
                    className={styles.input}
                />
                {codigoCertificado && (
                    <button
                        onClick={() => setCodigoCertificado('')}
                        className={styles.btn}
                    >
                        Limpar
                    </button>
                )}
            </div>

            {errorCertificados && (
                <p className="text-sm text-red-600 text-center">{errorCertificados}</p>
            )}

            <section className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[30%]">
                    <img src={imagemIdesam} alt="" style={{ justifySelf: 'center' }} />

                    {codigoCertificado ? (
                        <SectionDetalhesCliente
                            codigo={codigoCertificado}
                            certificados={certificadosAtivos}
                            clientes={clientes}
                        />
                    ) : (
                        <>
                            <SomaDeDados totais={totais} />

                            {loadingCertificados || loadingClientes ? (
                                <p>Carregando certificados...</p>
                            ) : (
                                <SectionClientes
                                    clientes={clientes}
                                    certificados={certificadosFiltrados}
                                    selecionaCertificado={setCodigoCertificado}
                                />
                            )}
                        </>
                    )}
                </div>

                <div className="w-full md:w-[70%]">
                    <MapaSAFs
                        safs={safs}
                        onSafClick={mostraImagens}
                    />

                    <InfoSafMapa
                        certificados={certificadosFiltrados}
                        imagensPorAno={imagensPorAno}
                        selectedSaf={selectedSaf}
                    />
                </div>
            </section>
        </section>
    );
}
