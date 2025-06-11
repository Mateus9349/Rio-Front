// FormPlantio.tsx
import { useEffect, useState } from "react";
import { IPlantioCompleto } from "../../../interfaces/plantioCompleto.interface";
import { IPlantio } from "../../../interfaces/plantio.interface";
import { normalizar } from "../../../utils/funcoes";
import PlantioService from "../../../services/PlantioService";
import useCriaPlantio from "../../../hooks/plantio/usecriaPlantio";
import StatusDoPlantio from "../../StatusDoPlantio";
import ClientPart from "../../Parts/ClientePart";
import SAFPart from "../../Parts/SAFPart";
import ComunidadePart from "../../Parts/ComunidadePart";
import ProdutorPart from "../../Parts/ProdutorPart";
import PlantioPart from "../../Parts/PlantioPart";

interface FormPlantioProps {
    plantio: IPlantioCompleto;
    onVerificacaoFinalizada?: (ok: boolean) => void;
}

export default function FormPlantio({ plantio, onVerificacaoFinalizada }: FormPlantioProps) {
    const [dados] = useState<IPlantioCompleto>(() => ({
        ...plantio,
        Cliente: normalizar(plantio.Cliente),
        Comunidade: normalizar(plantio.Comunidade),
        Proprietario_Responsavel: normalizar(plantio.Proprietario_Responsavel),
        SAFs: normalizar(plantio.SAFs),
    }));

    const [clienteExiste, setClienteExiste] = useState<string | null>(null);
    const [safExiste, setSafExiste] = useState<string | null>(null);
    const [comunidadeExiste, setComunidadeExiste] = useState<string | null>(null);
    const [proprietarioExiste, setProprietarioExiste] = useState<string | null>(null);

    const [plantioExiste, setPlantioExiste] = useState(false);
    const [verificando, setVerificando] = useState(false);
    const [verificacaoIniciada, setVerificacaoIniciada] = useState(false);

    const {
        criarPlantio,
        resetStatus,
        errorPlantio,
        plantioCriado,
    } = useCriaPlantio();

    const verificarOuCriarPlantio = async (
        safId: string,
        comunidadeId: string,
        proprietarioId: string
    ) => {
        setVerificando(true);
        resetStatus();

        try {
            const payload: IPlantio = {
                clienteId: dados.ID_Cliente,
                safId,
                comunidadeId,
                proprietarioId,
                anoCompensacao: dados.Ano,
                tCO2Compensadas: Number(dados.tCO2compensadas || 0),
                numeroArvores: dados.Arvores,
                areaM2: dados.Area_m2,
            };

            const existe = await PlantioService.verificarPlantioRemoto(payload);
            setPlantioExiste(existe);

            if (!existe) await criarPlantio(payload);
        } catch (error) {
            console.error("Erro ao verificar/criar plantio:", error);
        } finally {
            setVerificando(false);
        }
    };

    useEffect(() => {
        const todosIdsObtidos = clienteExiste && safExiste && comunidadeExiste && proprietarioExiste;

        if (!verificacaoIniciada) {
            setVerificando(true);
            if (todosIdsObtidos) {
                setVerificacaoIniciada(true);
                verificarOuCriarPlantio(safExiste, comunidadeExiste, proprietarioExiste);
            }
        }
    }, [clienteExiste, safExiste, comunidadeExiste, proprietarioExiste]);

    useEffect(() => {
        if ((plantioExiste || plantioCriado) && onVerificacaoFinalizada) {
            onVerificacaoFinalizada(true);
        }
    }, [plantioExiste, plantioCriado]);

    return (
        <div className="w-[1100px] mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Visualização do Plantio</h2>

            <div className="flex gap-6 items-start">
                <div className="w-[60%] bg-white rounded-xl shadow-md p-6 border">
                    <form className="grid grid-cols-2 gap-4">
                        <ClientPart
                            cliente_id={dados.ID_Cliente}
                            cliente={dados.Cliente}
                            onChangeExistencia={setClienteExiste}
                        />

                        <SAFPart
                            SAF={dados.SAFs}
                            longitude={dados.Coord_x}
                            latitude={dados.Coord_y}
                            onChangeExistencia={setSafExiste}
                        />

                        <ComunidadePart
                            comunidade={dados.Comunidade}
                            onChangeExistencia={setComunidadeExiste}
                        />

                        <ProdutorPart
                            produtor={dados.Proprietario_Responsavel}
                            onChangeExistencia={setProprietarioExiste}
                        />

                        <PlantioPart dados={dados} handleChange={() => { }} />
                    </form>
                </div>

                <div className="w-[40%] bg-white rounded-xl shadow-md p-6 border h-fit">
                    <StatusDoPlantio
                        plantioJaCriado={plantioExiste}
                        errorPlantio={errorPlantio}
                        plantioCriado={plantioCriado}
                        onResetErro={resetStatus}
                    />

                    {verificando && (
                        <p className="text-blue-600 mt-2">🔄 Verificando informações, por favor aguarde...</p>
                    )}

                    {verificacaoIniciada && !verificando && !plantioCriado && !plantioExiste && (
                        <p className="text-yellow-600 mt-2">⚠️ Plantio ainda não cadastrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
