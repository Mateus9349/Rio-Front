import { useState } from "react";
import { IPlantio } from "../../interfaces/plantio.interface";
import PlantioService from "../../services/PlantioService";
import usePlantios from "./usePlantios";

export default function useCriaPlantio() {
  const [loadingPlantio, setLoadingPlantio] = useState(false);
  const [errorPlantio, setErrorPlantio] = useState<string | null>(null);
  const [plantioCriado, setPlantioCriado] = useState<IPlantio | null>(null);
  const { recarregarPlantios } = usePlantios();

  const criarPlantio = async (novoPlantio: IPlantio): Promise<boolean> => {
    try {
      setLoadingPlantio(true);

      if (
        !novoPlantio.safId ||
        !novoPlantio.comunidadeId ||
        !novoPlantio.proprietarioId
      ) {
        setErrorPlantio("Faltam identificadores obrigatórios para o plantio.");
        return false;
      }

      const existe = await PlantioService.verificarPlantioRemoto(novoPlantio);
      if (existe) {
        setErrorPlantio("Plantio já cadastrado com as mesmas informações.");
        return false;
      }

      const response = await PlantioService.criarPlantio(novoPlantio);
      setPlantioCriado(response);
      setErrorPlantio(null);

      await recarregarPlantios();
      return true;
    } catch (error: any) {
      console.error(error);
      setErrorPlantio("Erro ao cadastrar o plantio.");
      throw error; // ← Isso está fazendo o erro "vazar" e não retornando false
    } finally {
      setLoadingPlantio(false);
    }
  };

  const resetStatus = () => {
    setErrorPlantio(null);
    setPlantioCriado(null);
    setLoadingPlantio(false);
  };

  return {
    criarPlantio,
    loadingPlantio,
    errorPlantio,
    plantioCriado,
    resetStatus,
  };
}
