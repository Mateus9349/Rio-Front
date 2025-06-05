// File: components/TabelaPlantios.tsx
import { useEffect, useState } from "react";
import { IPlantioCompleto } from "../../interfaces/plantioCompleto.interface";
import useSafs from "../../hooks/Safs/useSafs";
import useComunidades from "../../hooks/comunidade/useComunidades";
import useProprietarios from "../../hooks/proprietario/useProprietarios";
import usePlantios from "../../hooks/plantio/usePlantios";
import { normalizar } from "../../utils/funcoes";
import TabelaHeader from "../TabelaHeader/TabelaHeader";
import LinhaPlantio from "../LinhaPlantio/LinhaPlantio";
import FormPlantio from "../Forms/FormPlantio/FormPlantio";

interface Props {
  dados: IPlantioCompleto[];
  recarrega?: number;
}

export default function TabelaPlantios({ dados, recarrega }: Props) {
  const { safs } = useSafs();
  const { comunidades } = useComunidades();
  const { proprietarios } = useProprietarios();
  const { plantios, loadingPlantios, recarregarPlantios } = usePlantios();
  const [statusCadastro, setStatusCadastro] = useState<(boolean | "aguardando")[]>([]);
  const [plantioSelecionado, setPlantioSelecionado] = useState<IPlantioCompleto | null>(null);
  const [contador, setContador] = useState(0);

  const gerarChave = (
    clienteId: string,
    safId: string,
    comunidadeId: string,
    proprietarioId: string,
    ano: number,
    tCO2: number,
    arvores: number,
    area: number
  ) => `${clienteId}-${safId}-${comunidadeId}-${proprietarioId}-${ano}-${tCO2}-${arvores}-${area}`;

  useEffect(() => {
    if (!safs.length || !comunidades.length || !proprietarios.length || !plantios.length) return;

    const mapCadastrados = new Map<string, boolean>();
    plantios.forEach(p => {
      const key = gerarChave(
        p.cliente.id,
        p.saf.id,
        p.comunidade.id,
        p.proprietario.id,
        p.anoCompensacao,
        Number(p.tCO2Compensadas),
        p.numeroArvores,
        Number(p.areaM2)
      );
      mapCadastrados.set(key, true);
    });

    const resultados = dados.map(plantio => {
      const saf = safs.find(s => normalizar(s.identificacao) === normalizar(plantio.SAFs));
      const comunidade = comunidades.find(c => normalizar(c.nome) === normalizar(plantio.Comunidade));
      const proprietario = proprietarios.find(p => normalizar(p.nome) === normalizar(plantio.Proprietario_Responsavel));
      if (!saf?.id || !comunidade?.id || !proprietario?.id) return "aguardando";

      const chave = gerarChave(
        plantio.ID_Cliente,
        saf.id,
        comunidade.id,
        proprietario.id,
        plantio.Ano,
        Number(plantio.tCO2compensadas || 0),
        plantio.Arvores,
        plantio.Area_m2
      );
      return mapCadastrados.has(chave);
    });

    setStatusCadastro(resultados);
  }, [recarrega, dados, safs, comunidades, proprietarios, plantios, contador]);

  const handleCadastroFinalizado = async () => {
    setPlantioSelecionado(null);
    await recarregarPlantios();
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <TabelaHeader />
        <tbody>
          {dados.map((plantio, index) => (
            <LinhaPlantio
              key={index}
              plantio={plantio}
              status={statusCadastro[index]}
              onCadastrar={() => setPlantioSelecionado(plantio)}
            />
          ))}
        </tbody>
      </table>

      {loadingPlantios && (
        <p className="text-center text-sm mt-2 text-gray-500">Carregando plantios cadastrados...</p>
      )}

      {plantioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-4xl">
            <FormPlantio
              plantio={plantioSelecionado}
              onVerificacaoFinalizada={handleCadastroFinalizado}
            />
          </div>
        </div>
      )}
    </div>
  );
}
