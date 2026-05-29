import styles from '../styles/Mapa.module.scss';
import { useMemo, useState } from 'react';
import useCertificados from '../hooks/certificados/useCertificados';
import type { ICliente } from '../interfaces/cliente.interface';
import { ISAF, IImagemSaf } from '../interfaces/SAF.interface';
import { MapaSAFs } from '../components/MapaSAFs/MapaSAFs';
import SectionClientes from '../components/SectionClientes/SectionClientes';
import SomaDeDados from '../components/SomaDeDados/SomaDeDados';
import SectionDetalhesCliente from '../components/SectionDetalhesCliente/SectionDetalhesCliente';
import imagemIdesam from '../assets/img/CO2.png';
import InfoSafMapa from '../components/InfoSafMapa/InfoSafMapa';
import {
    calcularTotaisCertificadoSafs,
    certificadoSafParaSafMapa,
    extrairSafsDoCertificado,
    normalizarCodigoCertificado,
    toImagemSafArray,
} from '../utils/certificadoSaf';

export default function Mapa() {
    const { certificados, loadingCertificados } = useCertificados();
    const [codigoCertificado, setCodigoCertificado] = useState('');
    const [imagens, setImagens] = useState<IImagemSaf[]>([]); // mantém url+ano
    const [selectedSaf, setSelectedSaf] = useState<ISAF>();

    const codigoCertificadoUpper = normalizarCodigoCertificado(codigoCertificado);

    const certificadosFiltrados = useMemo(() => {
        if (!codigoCertificadoUpper) return certificados;
        return certificados.filter(
            (certificado) =>
                normalizarCodigoCertificado(certificado.codigo) === codigoCertificadoUpper
        );
    }, [certificados, codigoCertificadoUpper]);

    const clientes = useMemo<ICliente[]>(() => {
        const clientesPorId = new Map<string, ICliente>();

        for (const certificado of certificados) {
            const cliente = certificado.cliente;
            if (!cliente?.id || !cliente.nome) continue;

            const key = String(cliente.id);
            const clienteExistente = clientesPorId.get(key);

            if (!clienteExistente || (!clienteExistente.imagem && cliente.imagem)) {
                clientesPorId.set(key, { ...cliente, id: cliente.id });
            }
        }

        return Array.from(clientesPorId.values()).sort((a, b) => a.nome.localeCompare(b.nome));
    }, [certificados]);

    const certificadoSafs = useMemo(
        () => certificadosFiltrados.flatMap((certificado) => extrairSafsDoCertificado(certificado)),
        [certificadosFiltrados]
    );

    const safs: ISAF[] = useMemo(() => {
        const safsPorId = new Map<string, ISAF>();

        for (const certificadoSaf of certificadoSafs) {
            const safMapa = certificadoSafParaSafMapa(certificadoSaf);
            if (!safMapa) continue;

            const key = safMapa.id ?? `${safMapa.identificacao}-${safMapa.latitude}-${safMapa.longitude}`;
            if (!safsPorId.has(key)) {
                safsPorId.set(key, safMapa);
            }
        }

        return Array.from(safsPorId.values());
    }, [certificadoSafs]);

    const totais = useMemo(
        () => calcularTotaisCertificadoSafs(certificadoSafs),
        [certificadoSafs]
    );

    // Ao clicar no SAF no mapa, guarda todas as imagens (com ano)
    const mostraImagens = (saf: ISAF) => {
        setImagens(toImagemSafArray(saf.imagens));
        setSelectedSaf(saf);
    };

    // ---- AGRUPA POR ANO (ordem desc; "Sem ano" por último) ----
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
            if (aNum && bNum) return nb - na; // anos numéricos desc
            if (aNum) return -1;              // num antes de "Sem ano"
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

            <section className="flex flex-col md:flex-row gap-6">
                {/* Painel lateral */}
                <div className="w-full md:w-[30%]">
                    <img src={imagemIdesam} alt="" style={{ justifySelf: 'center' }} />

                    {codigoCertificado ? (
                        <SectionDetalhesCliente
                            id={codigoCertificado}
                            certificados={certificados}
                        />
                    ) : (
                        <>
                            <SomaDeDados totais={totais} />

                            {loadingCertificados ? (
                                <p>Carregando clientes...</p>
                            ) : (
                                <SectionClientes
                                    clientes={clientes}
                                    certificados={certificados}
                                    selecionaCliente={setCodigoCertificado}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Mapa */}
                <div className="w-full md:w-[70%]">
                    <MapaSAFs
                        safs={safs}
                        onSafClick={mostraImagens}
                    />

                    <InfoSafMapa
                        imagensPorAno={imagensPorAno}
                        selectedSaf={selectedSaf}
                        certificados={certificadosFiltrados}
                    />
                </div>
            </section>
        </section>
    );
}
