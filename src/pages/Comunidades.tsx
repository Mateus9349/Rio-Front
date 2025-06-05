import CardComunidade from "../components/Cards/CardComunidade/CardComunidade";
import useComunidades from "../hooks/comunidade/useComunidades";

export default function Comunidades() {
    const { comunidades, loadingComunidade, erroComunidade } = useComunidades();

    return (
        <div className="px-6 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Comunidades Cadastradas</h1>

            {loadingComunidade && <p className="text-gray-600">Carregando comunidades...</p>}
            {erroComunidade && <p className="text-red-500">Erro: {erroComunidade.message}</p>}

            <div className="flex flex-wrap gap-6">
                {comunidades.map((comunidade) => (
                    <CardComunidade key={comunidade.id} comunidade={comunidade} />
                ))}
            </div>
        </div>
    );
}
