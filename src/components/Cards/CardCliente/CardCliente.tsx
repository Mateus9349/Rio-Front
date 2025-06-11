import { ICliente } from "../../../interfaces/cliente.interface";
import IMAGEM_PADRAO from '../../../assets/img/eu-sou-exibicao-masculino.png';

interface CardClienteProps {
    cliente: ICliente;
}

export default function CardCliente({ cliente }: CardClienteProps) {
    const imagem = cliente.imagem && cliente.imagem.trim() !== "" ? cliente.imagem : IMAGEM_PADRAO;

    // Remove qualquer texto entre parênteses e espaços extras
    const nomeLimpo = cliente.nome.replace(/\s*\(.*?\)\s*/g, "").trim();

    return (
        <div className="bg-white p-4 rounded shadow flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-3">
                <img
                    src={imagem}
                    alt={nomeLimpo}
                    className="w-full h-full object-cover"
                />
            </div>
            <p className="text-gray-800 font-medium">{nomeLimpo}</p>
        </div>
    );
}
