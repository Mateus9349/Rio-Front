import { useEffect } from "react";
import CardPlantio from "../components/Cards/CardPlantio/CardPlantio";
import usePlantios from "../hooks/plantio/usePlantios";
import PlantioService from "../services/PlantioService";

export default function Plantios() {
    const { plantios, loadingPlantios, errorPlantios, recarregarPlantios } = usePlantios();

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

    useEffect(() => {
        console.log(plantios);
    }, [plantios]);

    return (
        <div className="px-6 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Plantios Cadastrados</h1>

            {loadingPlantios && <p className="text-gray-600">Carregando plantios...</p>}
            {errorPlantios && <p className="text-red-500">Erro: {errorPlantios}</p>}

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
                        />
                    ))}
            </div>
        </div>
    );
}
