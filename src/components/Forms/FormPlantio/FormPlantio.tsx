// FormPlantio.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { normalizar } from "../../../utils/funcoes";
import StatusDoPlantio from "../../StatusDoPlantio";
import ClientPart from "../../Parts/ClientePart";
import SAFPart from "../../Parts/SAFPart";
import ComunidadePart from "../../Parts/ComunidadePart";
import ProdutorPart from "../../Parts/ProdutorPart";
import PlantioPart from "../../Parts/PlantioPart";
import type {
    ICertificado,
    ICreateCertificadoDto,
    ICreateCertificadoSafDto,
} from "../../../interfaces/certificado.interface";
import useCertificados from "../../../hooks/certificados/useCertificados";
import { getErrorMessage } from "../../../utils/errors";

interface FormPlantioProps {
    certificado: ICertificado;
    onVerificacaoFinalizada?: (ok: boolean) => void;
}

type UUID = string;

const isValidString = (value: string | null | undefined) => {
    return typeof value === "string" && value.trim().length > 0;
};

const isValidNumber = (value: number | null | undefined) => {
    return typeof value === "number" && Number.isFinite(value);
};

const finalizar = (
    ok: boolean,
    setVerificacaoFinalizada: (value: boolean) => void,
    onVerificacaoFinalizada?: (ok: boolean) => void
) => {
    setVerificacaoFinalizada(true);
    onVerificacaoFinalizada?.(ok);
};

export default function FormPlantio({ certificado, onVerificacaoFinalizada }: FormPlantioProps) {
    const [dados] = useState<ICertificado>(() => ({
        ...certificado,
        codigo: normalizar(certificado.codigo),
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
    const [certificadoCriado, setCertificadoCriado] = useState<ICertificado | null>(null);
    const [erroCertificado, setErroCertificado] = useState<string | null>(null);
    const [processandoCertificado, setProcessandoCertificado] = useState(false);
    const [verificacaoFinalizada, setVerificacaoFinalizada] = useState(false);
    const processamentoIniciadoRef = useRef(false);

    const {
        buscarCertificadoPorCodigo,
        verificarExistenciaPorCodigoESaf,
        criarCertificado,
        adicionarSafAoCertificado,
    } = useCertificados();

    const handleClienteExiste = useCallback((id: number | null) => setClienteExiste(id), []);
    const handleSafExiste = useCallback((id: string) => setSafExiste(id), []);
    const handleComunidadeExiste = useCallback((id: string) => setComunidadeExiste(id), []);
    const handleProprietarioExiste = useCallback((id: string) => setProprietarioExiste(id), []);

    const resetErroCertificado = useCallback(() => {
        setErroCertificado(null);
        setVerificacaoFinalizada(false);
        processamentoIniciadoRef.current = false;
    }, []);

    const processarCertificado = useCallback(async () => {
        if (
            clienteExiste === null ||
            safExiste === null ||
            comunidadeExiste === null ||
            proprietarioExiste === null
        ) {
            return;
        }

        setProcessandoCertificado(true);
        setErroCertificado(null);
        setCertificadoCriado(null);
        setCertificadoExiste(false);

        try {
            const respostaExistencia = await verificarExistenciaPorCodigoESaf(
                dados.codigo,
                dados.saf.identificacao
            );
            const jaExiste = respostaExistencia?.existe === true;

            setCertificadoExiste(jaExiste);

            if (jaExiste) {
                finalizar(true, setVerificacaoFinalizada, onVerificacaoFinalizada);
                return;
            }

            const payloadSaf: ICreateCertificadoSafDto = {
                safId: safExiste,
                comunidadeId: comunidadeExiste,
                proprietarioId: proprietarioExiste,
                tco2Compensadas: Number(dados.tco2Compensadas || 0),
                arvores: Number(dados.arvores || 0),
                areaM2: Number(dados.areaM2 || 0),
            };

            const certificadoExistentePorCodigo = await buscarCertificadoPorCodigo(dados.codigo);

            if (certificadoExistentePorCodigo?.id) {
                if (
                    certificadoExistentePorCodigo.cliente?.id &&
                    Number(certificadoExistentePorCodigo.cliente.id) !== Number(clienteExiste)
                ) {
                    throw new Error(
                        "Conflito: já existe certificado com este código para outro cliente."
                    );
                }

                if (
                    certificadoExistentePorCodigo.ano &&
                    Number(certificadoExistentePorCodigo.ano) !== Number(dados.ano)
                ) {
                    throw new Error(
                        "Conflito: já existe certificado com este código para outro ano."
                    );
                }

                console.log("Payload enviado para criar certificado:", payloadSaf);
                const response = await adicionarSafAoCertificado(
                    certificadoExistentePorCodigo.id,
                    payloadSaf
                );
                console.log("Resposta da criação do certificado:", response);

                if (!response?.id) {
                    throw new Error("SAF não foi anexada ao certificado no backend.");
                }

                setCertificadoCriado(certificadoExistentePorCodigo);
                finalizar(true, setVerificacaoFinalizada, onVerificacaoFinalizada);
                return;
            }

            const payload: ICreateCertificadoDto = {
                codigo: dados.codigo,
                clienteId: clienteExiste,
                ano: Number(dados.ano || 0),
                ...payloadSaf,
            };

            console.log("Payload enviado para criar certificado:", payload);
            const certificadoCriadoResponse = await criarCertificado(payload);
            console.log("Resposta da criação do certificado:", certificadoCriadoResponse);

            if (!certificadoCriadoResponse?.id) {
                throw new Error("Certificado não foi criado no backend.");
            }

            setCertificadoCriado(certificadoCriadoResponse);
            finalizar(true, setVerificacaoFinalizada, onVerificacaoFinalizada);
        } catch (error: unknown) {
            console.error("Erro ao verificar/criar certificado:", error);
            setErroCertificado(getErrorMessage(error, "Erro ao verificar/criar certificado."));
            finalizar(false, setVerificacaoFinalizada, onVerificacaoFinalizada);
        } finally {
            setProcessandoCertificado(false);
        }
    }, [
        adicionarSafAoCertificado,
        buscarCertificadoPorCodigo,
        clienteExiste,
        comunidadeExiste,
        dados,
        onVerificacaoFinalizada,
        proprietarioExiste,
        safExiste,
        verificarExistenciaPorCodigoESaf,
        criarCertificado,
    ]);

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
    }, [clienteExiste, safExiste, comunidadeExiste, proprietarioExiste, processarCertificado]);

    return (
        <div className="w-[1100px] mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Visualização do Certificado</h2>

            <div className="flex gap-6 items-start">
                <div className="w-[60%] bg-white rounded-xl shadow-md p-6 border">
                    <form className="grid grid-cols-2 gap-4">
                        <ClientPart
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
                        errorCertificado={erroCertificado}
                        certificadoCriado={certificadoCriado}
                        onResetErro={resetErroCertificado}
                    />

                    {processandoCertificado && (
                        <p className="text-blue-600 mt-2">🔄 Verificando informações, por favor aguarde...</p>
                    )}

                    {verificacaoFinalizada && !processandoCertificado && !certificadoCriado && !certificadoExiste && !erroCertificado && (
                        <p className="text-yellow-600 mt-2">⚠️ Certificado ainda não cadastrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
