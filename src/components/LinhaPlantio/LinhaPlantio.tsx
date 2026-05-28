// File: components/LinhaPlantio.tsx
import { ICertificado } from "../../interfaces/certificado.interface";

interface Props {
    plantio: ICertificado;
    status: boolean | "aguardando" | "verificando";
    onCadastrar?: (plantio: ICertificado) => void;
}

export default function LinhaPlantio({ plantio, status, onCadastrar }: Props) {
    return (
        <tr>
            <td className="border px-4 py-2">{plantio.codigo}</td>
            <td className="border px-4 py-2">{plantio.cliente.nome}</td>
            <td className="border px-4 py-2">{plantio.ano}</td>
            <td className="border px-4 py-2">{plantio.tco2Compensadas}</td>
            <td className="border px-4 py-2">{plantio.arvores}</td>
            <td className="border px-4 py-2">{plantio.areaM2}</td>
            <td className="border px-4 py-2">{plantio.saf.identificacao}</td>
            <td className="border px-4 py-2">{plantio.saf.localizacao.latitude}</td>
            <td className="border px-4 py-2">{plantio.saf.localizacao.longitude}</td>
            <td className="border px-4 py-2">{plantio.comunidade.nome}</td>
            <td className="border px-4 py-2">{plantio.proprietario.nome}</td>
            <td className="border px-4 py-2">
                {status === "aguardando" && "⏳ Aguardando IDs"}
                {status === "verificando" && "🔍 Verificando..."}
                {typeof status === "boolean" && (status ? "✅ Cadastrado" : "🟡 Não cadastrado")}
            </td>
            <td className="border px-4 py-2">
                {typeof status === "boolean" && !status && (
                    <button
                        onClick={() => onCadastrar?.(plantio)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        Cadastrar
                    </button>
                )}
            </td>
        </tr>
    );
}
