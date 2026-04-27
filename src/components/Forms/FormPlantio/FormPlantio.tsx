// FormPlantio.tsx
import { useCallback, useEffect, useRef, useState } from "react";
/* import { IPlantioCompleto } from "../../../interfaces/plantioCompleto.interface";
import { IPlantio } from "../../../interfaces/plantio.interface";
import PlantioService from "../../../services/PlantioService";
import useCriaPlantio from "../../../hooks/plantio/usecriaPlantio";
import { da } from "zod/v4/locales"; */
import { normalizar } from "../../../utils/funcoes";
import StatusDoPlantio from "../../StatusDoPlantio";
import ClientPart from "../../Parts/ClientePart";
import SAFPart from "../../Parts/SAFPart";
import ComunidadePart from "../../Parts/ComunidadePart";
import ProdutorPart from "../../Parts/ProdutorPart";
import PlantioPart from "../../Parts/PlantioPart";
import { ICertificado, ICreateCertificadoDto } from "../../../interfaces/certificado.interface";
import { useVerificaExisteCertificado } from "../../../hooks/certificados/useVerificaExistenciaCertificado";
import useCreateCertificado from "../../../hooks/certificados/useCreateCertificado";

interface FormPlantioProps {
    certificado: ICertificado;
    onVerificacaoFinalizada?: (ok: boolean) => void;
}

type UUID = string;

const isValidString = (value: string | null | undefined) => {
    return typeof value === "string" && value.trim().length > 0;
};

const isValidNumber = (value: number | null | undefined) => {
    return typeof value === "number";
};

export default function FormPlantio({ certificado, onVerificacaoFinalizada }: FormPlantioProps) {
    const [dados] = useState<ICertificado>(() => ({
        ...certificado,
        cliente: {
            ...certificado.cliente,
            nome: normalizar(certificado.cliente.nome),
        },
        comunidade: {
            ...certificado.comunidade,
            nome: normalizar(certificado.comunidade.nome),
        },
        proprietario: {
            ...certificado.proprietario,
            nome: normalizar(certificado.proprietario.nome),
        },
        saf: {
            ...certificado.saf,
            identificacao: normalizar(certificado.saf.identificacao),
        },
    }));

    const [clienteExiste, setClienteExiste] = useState<number | null>(null);
    const [safExiste, setSafExiste] = useState<UUID | null>(null);
    const [comunidadeExiste, setComunidadeExiste] = useState<UUID | null>(null);
    const [proprietarioExiste, setProprietarioExiste] = useState<UUID | null>(null);
    const [certificadoExiste, setCertificadoExiste] = useState(false);
    /* const [verificando, setVerificando] = useState(false); */
    const [verificacaoFinalizada, setVerificacaoFinalizada] = useState(false);
    const processamentoIniciadoRef = useRef(false);

    const {
        verificarExisteCertificado,
        loadingVerificaExistencia
    } = useVerificaExisteCertificado();
    const {
        criarCertificado,
        resetCreateCertificado,
        errorCreateCertificado,
        certificadoCriado,
        loadingCreateCertificado
    } = useCreateCertificado();

    const handleClienteExiste = useCallback(setClienteExiste, []);
    const handleSafExiste = useCallback(setSafExiste, []);
    const handleComunidadeExiste = useCallback(setComunidadeExiste, []);
    const handleProprietarioExiste = useCallback(setProprietarioExiste, []);

    const processarCertificado = async () => {
        if (
            clienteExiste === null ||
            safExiste === null ||
            comunidadeExiste === null ||
            proprietarioExiste === null
        ) {
            return;
        }

        resetCreateCertificado();

        try {
            const existe = await verificarExisteCertificado(dados.codigo, dados.saf.identificacao);
            const jaExiste = Boolean(existe);

            setCertificadoExiste(jaExiste);

            if (jaExiste) {
                setVerificacaoFinalizada(true);
                onVerificacaoFinalizada?.(true);
                return;
            } else {
                const payload: ICreateCertificadoDto = {
                    codigo: dados.codigo,
                    clienteId: clienteExiste,
                    safId: safExiste,
                    comunidadeId: comunidadeExiste,
                    proprietarioId: proprietarioExiste,
                    ano: dados.ano,
                    tco2Compensadas: String(dados.tco2Compensadas || 0),
                    arvores: dados.arvores,
                    areaM2: String(dados.areaM2),
                };

                await criarCertificado(payload);
            }
        } catch (error) {
            console.error("Erro ao verificar/criar certificado:", error);
            setVerificacaoFinalizada(true);
            onVerificacaoFinalizada?.(false);
        }
    };

    useEffect(() => {
        const idsProntos =
            isValidNumber(clienteExiste) &&
            isValidString(safExiste) &&
            isValidString(comunidadeExiste) &&
            isValidString(proprietarioExiste);

        if (!idsProntos) return;
        if (processamentoIniciadoRef.current) return;

        processamentoIniciadoRef.current = true;
        processarCertificado();
    }, [clienteExiste, safExiste, comunidadeExiste, proprietarioExiste]);

    useEffect(() => {
        if (certificadoCriado) {
            setVerificacaoFinalizada(true);
            onVerificacaoFinalizada?.(true);
        }
    }, [certificadoCriado, onVerificacaoFinalizada]);

    useEffect(() => {
        if (errorCreateCertificado) {
            setVerificacaoFinalizada(true);
            onVerificacaoFinalizada?.(false);
        }
    }, [errorCreateCertificado, onVerificacaoFinalizada]);

    return (
        <div className="w-[1100px] mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Visualização do Plantio</h2>

            <div className="flex gap-6 items-start">
                <div className="w-[60%] bg-white rounded-xl shadow-md p-6 border">
                    <form className="grid grid-cols-2 gap-4">
                        <ClientPart
                            /* cliente_id={dados.ID_Cliente} */
                            cliente={dados.cliente.nome}
                            onChangeExistencia={handleClienteExiste}
                        />

                        <SAFPart
                            SAF={dados.saf.identificacao}
                            longitude={dados.saf.localizacao.longitude!}
                            latitude={dados.saf.localizacao.latitude!}
                            onChangeExistencia={handleSafExiste}
                        />

                        <ComunidadePart
                            comunidade={dados.comunidade.nome}
                            onChangeExistencia={handleComunidadeExiste}
                        />

                        <ProdutorPart
                            produtor={dados.proprietario.nome}
                            onChangeExistencia={handleProprietarioExiste}
                        />

                        <PlantioPart dados={dados} handleChange={() => { }} />
                    </form>
                </div>

                <div className="w-[40%] bg-white rounded-xl shadow-md p-6 border h-fit">
                    <StatusDoPlantio
                        certificadoJaCriado={certificadoExiste}
                        errorCertificado={errorCreateCertificado}
                        certificadoCriado={certificadoCriado}
                        onResetErro={resetCreateCertificado}
                    />

                    {loadingVerificaExistencia || loadingCreateCertificado && (
                        <p className="text-blue-600 mt-2">🔄 Verificando informações, por favor aguarde...</p>
                    )}

                    {verificacaoFinalizada && !loadingVerificaExistencia && !certificadoCriado && !certificadoExiste && (
                        <p className="text-yellow-600 mt-2">⚠️ Plantio ainda não cadastrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
