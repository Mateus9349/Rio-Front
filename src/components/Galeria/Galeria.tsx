import ExibirImagem from "../ExibirImagem/ExibirImagem";

interface Props {
    imagens: string[] | undefined | null;
    excluirImagem: (imgem: string) => void;
}

export default function Galeria({ imagens, excluirImagem }: Props) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {imagens && imagens.length > 0 ? (
                imagens.map((imagem, index) => (
                    <div className="flex flex-col items-center gap-1" key={index}>
                        <ExibirImagem src={imagem} />

                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition cursor-pointer"
                            onClick={() => excluirImagem(imagem)}
                        >

                            Excluir
                        </button>
                    </div>
                ))
            ) : (
                <h4 className="text-gray-600">Não há imagens registradas</h4>
            )}
        </div>
    );
}
