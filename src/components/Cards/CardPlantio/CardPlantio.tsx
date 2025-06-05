import { IPlantioBack } from "../../../interfaces/plantioBack.interface";

interface Props {
    plantio: IPlantioBack;
    onExcluir: () => void;
}

export default function CardPlantio({ plantio, onExcluir }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
                {plantio.cliente.nome} - {plantio.anoCompensacao}
            </h3>
            <p className="text-sm text-gray-600"><strong>Cliente:</strong> {plantio.cliente.id}</p>
            <p className="text-sm text-gray-600"><strong>SAF:</strong> {plantio.saf.identificacao}</p>
            <p className="text-sm text-gray-600"><strong>Comunidade:</strong> {plantio.comunidade.nome}</p>
            <p className="text-sm text-gray-600"><strong>Proprietário:</strong> {plantio.proprietario.nome}</p>
            <p className="text-sm text-gray-600"><strong>Área:</strong> {plantio.areaM2} m²</p>
            <p className="text-sm text-gray-600"><strong>tCO₂:</strong> {plantio.tCO2Compensadas}</p>

            <button
                onClick={onExcluir}
                className="mt-4 px-4 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700"
            >
                Excluir
            </button>
        </div>
    );
}
