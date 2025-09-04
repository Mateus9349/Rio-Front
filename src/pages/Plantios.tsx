import { useEffect, useState } from "react";
import CardPlantio from "../components/Cards/CardPlantio/CardPlantio";
import usePlantios from "../hooks/plantio/usePlantios";
import PlantioService from "../services/PlantioService";
import { IPlantioBack } from "../interfaces/plantioBack.interface";
import CardPlantioCompleto from "../components/Cards/CardPlantioCompleto/CardPlantioCompleto";
import AdicionarImagens from "../components/AdicionarImagens/AdicionarImagens";

export default function Plantios() {
    const { plantios, loadingPlantios, errorPlantios, recarregarPlantios } = usePlantios();

    const [menu, setMenu] = useState<'plantios' | 'imagens' | null>('plantios');
    const [selectedPlantio, setSelectedPlantio] = useState<IPlantioBack | null>(null);

    const handleExcluirPlantio = async (id: string) => {
        const confirmacao = confirm("Deseja realmente excluir este plantio?");
        if (!confirmacao) return;

        try {
            await PlantioService.removerPlantio(id);
            await recarregarPlantios();
        } catch (erro) {
            console.error("Erro ao excluir plantio:", erro);
            alert("Erro ao excluir plantio.");
        }
    };

    const handleAddImagens = async (href: string) => {
        if (!selectedPlantio) return;

        try {
            // Junta as imagens existentes com a nova (garantindo que seja array)
            const imagensExistentes = selectedPlantio.imagens ?? [];
            const imagensAtualizadas = [...imagensExistentes, href];

            // Atualiza o campo de imagens
            await PlantioService.atualizarPlantio(selectedPlantio.id!, {
                imagens: imagensAtualizadas,
            });

            // Busca o plantio atualizado para refletir no front
            const plantioAtualizado = await PlantioService.buscarPlantio(selectedPlantio.id!);

            // Atualiza o estado com os dados mais recentes
            setSelectedPlantio(plantioAtualizado);

            alert("Imagem adicionada com sucesso!");
        } catch (erro) {
            console.error("Erro ao adicionar imagem:", erro);
            alert("Erro ao adicionar imagem.");
        }
    };

    const handleExcluirImagem = async (imagem: string) => {
        if (!selectedPlantio) return;

        try {
            const imagensAtualizadas = (selectedPlantio.imagens ?? []).filter(img => img !== imagem);

            await PlantioService.atualizarPlantio(selectedPlantio.id!, {
                imagens: imagensAtualizadas,
            });

            const plantioAtualizado = await PlantioService.buscarPlantio(selectedPlantio.id!);
            setSelectedPlantio(plantioAtualizado);

            alert("Imagem removida com sucesso!");
        } catch (erro) {
            console.error("Erro ao excluir imagem:", erro);
            alert("Erro ao excluir imagem.");
        }
    };

    useEffect(() => {

    }, [plantios]);

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Plantios Cadastrados</h1>

            {loadingPlantios && <p className="text-gray-600">Carregando plantios...</p>}
            {errorPlantios && <p className="text-red-500">Erro: {errorPlantios}</p>}

            {menu === 'plantios' &&
                <div className="flex flex-wrap gap-6">
                    {[...plantios]
                        .sort((a, b) => {
                            if (a.anoCompensacao !== b.anoCompensacao)
                                return b.anoCompensacao - a.anoCompensacao;

                            if (a.saf.identificacao !== b.saf.identificacao)
                                return a.saf.identificacao.localeCompare(b.saf.identificacao);

                            return a.cliente.nome.localeCompare(b.cliente.nome);
                        })
                        .map((plantio) => (
                            <CardPlantio
                                key={plantio.id}
                                plantio={plantio}
                                onExcluir={() => handleExcluirPlantio(plantio.id!)}
                                onImagens={() => { setMenu('imagens'); setSelectedPlantio(plantio); }}
                            />
                        ))}
                </div>
            }

            {menu === 'imagens' &&
                <>
                    <CardPlantioCompleto plantio={selectedPlantio} excluirImagem={handleExcluirImagem} />

                    <AdicionarImagens onSubmit={handleAddImagens} />
                </>
            }
        </div>
    );
}
