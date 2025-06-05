import { IPlantio } from "../../interfaces/plantio.interface";

interface Props {
    plantioCriado: IPlantio | null;
    errorPlantio: string | null;
    plantioJaCriado: boolean;
    onResetErro?: () => void;
}

export default function StatusDoPlantio({ plantioCriado, errorPlantio, plantioJaCriado, onResetErro }: Props) {
    return (
        <div>
            {plantioCriado && !errorPlantio && !plantioJaCriado && (
                <p className="text-green-500 mt-2">✅ Plantio cadastrado com sucesso!</p>
            )}

            {plantioJaCriado && (
                <p className="text-red-500 mt-2">⚠️ Plantio com essas informações já consta no banco de dados.</p>
            )}

            {errorPlantio && (
                <div className="text-red-500 mt-2">
                    ❌ Erro ao criar plantio: {errorPlantio}
                    {onResetErro && (
                        <button onClick={onResetErro} className="ml-2 underline text-sm text-blue-600">
                            Tentar novamente
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
