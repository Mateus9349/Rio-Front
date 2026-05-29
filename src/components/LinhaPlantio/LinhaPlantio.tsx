// File: components/LinhaPlantio.tsx
import { ICertificado } from "../../interfaces/certificado.interface";

interface Props {
    certificado: ICertificado;
    status: boolean | "aguardando" | "verificando";
    onCadastrar?: (certificado: ICertificado) => void;
}

export default function LinhaPlantio({ certificado, status, onCadastrar }: Props) {
    return (
        <tr>
            <td className="border px-4 py-2">{certificado.codigo}</td>
            <td className="border px-4 py-2">{certificado.cliente.nome}</td>
            <td className="border px-4 py-2">{certificado.ano}</td>
            <td className="border px-4 py-2">{certificado.tco2Compensadas}</td>
            <td className="border px-4 py-2">{certificado.arvores}</td>
            <td className="border px-4 py-2">{certificado.areaM2}</td>
            <td className="border px-4 py-2">{certificado.saf.identificacao}</td>
            <td className="border px-4 py-2">{certificado.saf.localizacao.latitude}</td>
            <td className="border px-4 py-2">{certificado.saf.localizacao.longitude}</td>
            <td className="border px-4 py-2">{certificado.comunidade.nome}</td>
            <td className="border px-4 py-2">{certificado.proprietario.nome}</td>
            <td className="border px-4 py-2">
                {status === "aguardando" && "⏳ Aguardando IDs"}
                {status === "verificando" && "🔍 Verificando..."}
                {typeof status === "boolean" && (status ? "✅ Cadastrado" : "🟡 Não cadastrado")}
            </td>
            <td className="border px-4 py-2">
                {typeof status === "boolean" && !status && (
                    <button
                        onClick={() => onCadastrar?.(certificado)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        Cadastrar
                    </button>
                )}
            </td>
        </tr>
    );
}
