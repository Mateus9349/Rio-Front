import { IProprietario } from "../../../interfaces/proprietario.interface";

interface Props {
    proprietario: IProprietario;
}

export default function CardProprietario({ proprietario }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">{proprietario.nome}</h3>
            <p className="text-sm text-gray-600"><strong>ID:</strong> {proprietario.id}</p>
        </div>
    );
}
