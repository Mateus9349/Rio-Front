import { useEffect, useState } from "react";
import PlantioService from "../../services/PlantioService";
import { IPlantioBack } from "../../interfaces/plantioBack.interface";

export default function usePlantios() {
    const [plantios, setPlantios] = useState<IPlantioBack[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const carregarPlantios = async () => {
        try {
            setLoading(true);
            const dados = await PlantioService.listarPlantios(); // deve retornar plantios completos
            setPlantios(dados);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar os plantios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarPlantios();
    }, []);

    return {
        plantios,
        loadingPlantios: loading,
        errorPlantios: error,
        recarregarPlantios: carregarPlantios,
    };
}
