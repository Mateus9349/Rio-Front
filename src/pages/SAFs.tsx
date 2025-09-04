import { useState } from "react";
import CardSAF from "../components/Cards/CardSaf/CardSaf";
import useSafs from "../hooks/Safs/useSafs";
import { ISAF } from "../interfaces/SAF.interface";
import AdicionarImagens from "../components/AdicionarImagens/AdicionarImagens";
import SafService from "../services/SafService";
import Galeria from "../components/Galeria/Galeria";


export default function SAFs() {
  const { safs, loadingSaf, erroSaf } = useSafs();

  const [addImage, setAddImage] = useState(false);
  const [selectedSaf, setSelectedSaf] = useState<ISAF>({
    identificacao: " ",
    latitude: 0,
    longitude: 0
  });

  const handleAddImagens = async (link: string) => {
    if (!selectedSaf) return;

    try {
      // Junta as imagens existentes com a nova (garantindo que seja array)
      const imagensExistentes = selectedSaf.imagens ?? [];
      const imagensAtualizadas = [...imagensExistentes, link];

      // Atualiza o campo de imagens
      await SafService.atualizarSaf(selectedSaf.id!, { imagens: imagensAtualizadas });

      // Busca o plantio atualizado para refletir no front
      const safAtualizado = await SafService.buscarSaf(selectedSaf.id!);

      // Atualiza o estado com os dados mais recentes
      setSelectedSaf(safAtualizado);

      alert("Imagem adicionada com sucesso!");
    } catch (erro) {
      console.error("Erro ao adicionar imagem:", erro);
      alert("Erro ao adicionar imagem.");
    }
  }

  const handleExcluirImagem = async (imagem: string) => {
    if (!selectedSaf) return;

    try {
      const imagensAtualizadas = (selectedSaf.imagens ?? []).filter(img => img !== imagem);

      await SafService.atualizarSaf(selectedSaf.id!, {
        imagens: imagensAtualizadas,
      });

      const safAtualizado = await SafService.buscarSaf(selectedSaf.id!);
      setSelectedSaf(safAtualizado);

      alert("Imagem removida com sucesso!");
    } catch (erro) {
      console.error("Erro ao excluir imagem:", erro);
      alert("Erro ao excluir imagem.");
    }
  };

  return (
    <div className="px-6 py-8">
      {loadingSaf && <p className="text-gray-600">Carregando SAFs...</p>}
      {erroSaf && <p className="text-red-500">Erro: {erroSaf.message}</p>}

      {!addImage &&
        <>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">SAFs Cadastrados</h1>

          <div className="flex flex-wrap gap-6">
            {safs.map((saf) => (
              <div key={saf.id}>
                <CardSAF saf={saf} />
                <button
                  onClick={() => { setAddImage(true), setSelectedSaf(saf) }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  add imagens
                </button>
              </div>
            ))}
          </div>
        </>
      }

      {addImage &&
        <>
          <button
            onClick={() => setAddImage(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            voltar
          </button>
          <CardSAF saf={selectedSaf} />
          <Galeria imagens={selectedSaf?.imagens} excluirImagem={handleExcluirImagem} />
          <AdicionarImagens onSubmit={handleAddImagens} />
        </>
      }
    </div>
  );
}
