import styles from '../styles/Mapa.module.scss';
import { useMemo, useState } from 'react';
import usePlantios from '../hooks/plantio/usePlantios';
import useClientes from '../hooks/clientes/useClientes';
import { ISAF } from '../interfaces/SAF.interface';
import { MapaSAFs } from '../components/MapaSAFs/MapaSAFs';
import SectionClientes from '../components/SectionClientes/SectionClientes';
import SomaDeDados from '../components/SomaDeDados/SomaDeDados';
import SectionDetalhesCliente from '../components/SectionDetalhesCliente/SectionDetalhesCliente';
import imagemIdesam from '../assets/img/CO2.png';
import ExibirImagem from '../components/ExibirImagem/ExibirImagem';

export default function Mapa() {
    const { plantios } = usePlantios();
    const { clientes } = useClientes();
    const [clienteId, setClienteId] = useState('');
    const [imagens, setImagens] = useState<string[]>([]);

    const clienteIdUpper = clienteId.trim().toUpperCase();

    const plantiosFiltrados = useMemo(() => {
        if (!clienteIdUpper) return plantios;
        return plantios.filter(p => p.cliente.id.toUpperCase() === clienteIdUpper);
    }, [plantios, clienteIdUpper]);

    const clientesFiltrados = useMemo(() => {
        if (!clienteIdUpper) {
            return clientes
                .map((cliente) => {
                    const plantiosCliente = plantios.filter(p => p.cliente.id === cliente.id);
                    const maisRecente = Math.max(...plantiosCliente.map(p => p.anoCompensacao ?? 0), 0);
                    return { cliente, maisRecente };
                })
                .filter(item => item.maisRecente > 0) // só clientes com pelo menos 1 plantio
                .sort((a, b) => b.maisRecente - a.maisRecente)
                .map(item => item.cliente);
        }

        return clientes.filter(c => c.id.toUpperCase() === clienteIdUpper);
    }, [clientes, plantios, clienteIdUpper]);

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
                imagens: p.saf!.imagens ?? [],   // <- ESSENCIAL
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

    const mostraImagens = (saf: ISAF) => {
        setImagens(saf.imagens ?? []);
    }

    return (
        <main className="space-y-6">
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

                            <SectionClientes
                                clientes={clientesFiltrados}
                                plantios={plantiosFiltrados}
                                selecionaCliente={setClienteId}
                            />
                        </>
                    )}
                </div>

                {/* Mapa */}
                <div className="w-full md:w-[70%]">
                    <MapaSAFs
                        safs={safs}
                        onSafClick={mostraImagens}
                    />

                    {!!imagens.length && (
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {imagens.map((img) => (
                                <ExibirImagem 
                                    src={img}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
