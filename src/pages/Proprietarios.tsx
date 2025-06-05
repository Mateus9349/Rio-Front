import CardProprietario from "../components/Cards/CardProprietario/CardProprietario";
import useProprietarios from "../hooks/proprietario/useProprietarios";

export default function Proprietarios() {
    const { proprietarios, loadingProprietario, erroProprietario } = useProprietarios();

    return (
        <div className="px-6 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Proprietários Cadastrados</h1>

            {loadingProprietario && <p className="text-gray-600">Carregando proprietários...</p>}
            {erroProprietario && <p className="text-red-500">Erro: {erroProprietario.message}</p>}

            <div className="flex flex-wrap gap-6">
                {proprietarios.map((proprietario) => (
                    <CardProprietario key={proprietario.id} proprietario={proprietario} />
                ))}
            </div>
        </div>
    );
}
