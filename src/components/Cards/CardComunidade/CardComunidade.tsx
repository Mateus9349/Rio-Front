import { IComunidade } from "../../../interfaces/comunidade.interface";

interface Props {
    comunidade: IComunidade;
}

export default function CardComunidade({ comunidade }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">{comunidade.nome}</h3>
            <p className="text-sm text-gray-600"><strong>ID:</strong> {comunidade.id}</p>
        </div>
    );
}
