import { IPlantioCompleto } from "../../interfaces/plantioCompleto.interface";

interface Props {
    plantio: IPlantioCompleto;
    status: boolean | "aguardando" | "verificando";
    onCadastrar?: (plantio: IPlantioCompleto) => void;
}

export default function LinhaPlantio({ plantio, status, onCadastrar }: Props) {
    return (
        <tr>
            <td className="border px-4 py-2">{plantio.ID_Cliente}</td>
            <td className="border px-4 py-2">{plantio.Cliente}</td>
            <td className="border px-4 py-2">{plantio.Ano}</td>
            <td className="border px-4 py-2">{plantio.tCO2compensadas}</td>
            <td className="border px-4 py-2">{plantio.Arvores}</td>
            <td className="border px-4 py-2">{plantio.Area_m2}</td>
            <td className="border px-4 py-2">{plantio.SAFs}</td>
            <td className="border px-4 py-2">{plantio.Coord_x}</td>
            <td className="border px-4 py-2">{plantio.Coord_y}</td>
            <td className="border px-4 py-2">{plantio.Comunidade}</td>
            <td className="border px-4 py-2">{plantio.Proprietario_Responsavel}</td>
            <td className="border px-4 py-2">
                {status === "aguardando"
                    ? "⏳ Aguardando IDs"
                    : status === "verificando"
                        ? "🔍 Verificando..."
                        : status
                            ? "✅ Cadastrado"
                            : "🟡 Não cadastrado"}
            </td>
            <td className="border px-4 py-2">
                {!status && status !== "aguardando" && (
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
