import { ICliente } from "../../../interfaces/cliente.interface";

interface Props {
    cliente: ICliente;
}

export default function CardCliente({ cliente }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">{cliente.nome}</h3>
            <p className="text-sm text-gray-600"><strong>ID:</strong> {cliente.id}</p>
        </div>
    );
}
