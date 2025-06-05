import CardSAF from "../components/Cards/CardSaf/CardSaf";
import useSafs from "../hooks/Safs/useSafs";


export default function SAFs() {
  const { safs, loadingSaf, erroSaf } = useSafs();

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">SAFs Cadastrados</h1>

      {loadingSaf && <p className="text-gray-600">Carregando SAFs...</p>}
      {erroSaf && <p className="text-red-500">Erro: {erroSaf.message}</p>}

      <div className="flex flex-wrap gap-6">
        {safs.map((saf) => (
          <CardSAF key={saf.id} saf={saf} />
        ))}
      </div>
    </div>
  );
}
