import { ICertificado } from "../../interfaces/certificado.interface";

interface Props {
    certificadoCriado: ICertificado | null;
    errorCertificado: string | null;
    certificadoJaCriado: boolean;
    onResetErro?: () => void;
}

export default function StatusDoPlantio({ certificadoCriado, errorCertificado, certificadoJaCriado, onResetErro }: Props) {
    return (
        <div>
            {certificadoCriado && !errorCertificado && !certificadoJaCriado && (
                <p className="text-green-500 mt-2">✅ Plantio cadastrado com sucesso!</p>
            )}

            {certificadoJaCriado && (
                <p className="text-red-500 mt-2">⚠️ Plantio com essas informações já consta no banco de dados.</p>
            )}

            {errorCertificado && (
                <div className="text-red-500 mt-2">
                    ❌ Erro ao criar plantio: {errorCertificado}
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
