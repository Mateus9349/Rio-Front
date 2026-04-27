import styles from '../styles/Mapa.module.scss';
import { useMemo, useState } from 'react';
import usePlantios from '../hooks/plantio/usePlantios';
import {useClientes} from '../hooks/clientes/useClientes';
import { ISAF, IImagemSaf } from '../interfaces/SAF.interface';
import { MapaSAFs } from '../components/MapaSAFs/MapaSAFs';
import SectionClientes from '../components/SectionClientes/SectionClientes';
import SomaDeDados from '../components/SomaDeDados/SomaDeDados';
import SectionDetalhesCliente from '../components/SectionDetalhesCliente/SectionDetalhesCliente';
import imagemIdesam from '../assets/img/CO2.png';
import InfoSafMapa from '../components/InfoSafMapa/InfoSafMapa';

function toImagemSafArray(v: unknown): IImagemSaf[] {
    if (!Array.isArray(v)) return [];
    return v.map((item: any) =>
        typeof item === 'string' ? { url: item, ano: undefined as any } : item
    );
}

export default function Mapa() {
    const { plantios } = usePlantios();
    const { clientes, loadingClientes } = useClientes();
    const [clienteId, setClienteId] = useState('');
    const [imagens, setImagens] = useState<IImagemSaf[]>([]); // mantém url+ano
    const [selectedSaf, setSelectedSaf] = useState<ISAF>();

    const clienteIdUpper = clienteId.trim().toUpperCase();

    const plantiosFiltrados = useMemo(() => {
        if (!clienteIdUpper) return plantios;
        return plantios.filter(p => p.cliente.id.toUpperCase() === clienteIdUpper);
    }, [plantios, clienteIdUpper]);

    const clientesFiltrados = useMemo(() => {
  if (!clienteId) {
    return [...clientes].sort((a, b) => a.nome.localeCompare(b.nome));
  }

  const clienteIdNumber = Number(clienteId);

  if (Number.isNaN(clienteIdNumber)) {
    return [];
  }

  return clientes.filter((cliente) => cliente.id === clienteIdNumber);
}, [clientes, clienteId]);

    const safs: ISAF[] = useMemo(() => {
        return plantiosFiltrados
            .filter((p) => {
                const lat = Number(p.saf?.latitude ?? 0);
                const lng = Number(p.saf?.longitude ?? 0);
                return !!p.saf && !Number.isNaN(lat) && !Number.isNaN(lng) && lat !== 0 && lng !== 0;
            })
            .map((p) => ({
                id: p.saf!.id,
                identificacao: p.saf!.identificacao,
                latitude: Number(p.saf!.latitude),
                longitude: Number(p.saf!.longitude),
                imagens: toImagemSafArray(p.saf!.imagens), // mantém { url, ano }
            }));
    }, [plantiosFiltrados]);

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
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className={styles.input}
                />
                {clienteId && (
                    <button
                        onClick={() => setClienteId('')}
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

                    {clienteId ? (
                        <SectionDetalhesCliente
                            id={clienteId}
                            plantios={plantios}
                        />
                    ) : (
                        <>
                            <SomaDeDados totais={totais} />

                            {loadingClientes ? (
                                <p>Carregando clientes...</p>
                            ) : (
                                <SectionClientes
                                    clientes={clientesFiltrados}
                                    plantios={plantiosFiltrados}
                                    selecionaCliente={setClienteId}
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
                    />
                </div>
            </section>
        </section>
    );
}
