// PlantioCompletoForm.tsx
import { useState, useEffect } from "react";
import { IPlantioCompleto } from "../../../interfaces/plantioCompleto.interface";
import { IPlantio } from "../../../interfaces/plantio.interface";
import useCriaPlantio from "../../../hooks/plantio/usecriaPlantio";
import PlantioService from "../../../services/PlantioService";
import ClientPart from "../../Parts/ClientePart";
import SAFPart from "../../Parts/SAFPart";
import ComunidadePart from "../../Parts/ComunidadePart";
import ProdutorPart from "../../Parts/ProdutorPart";
import PlantioPart from "../../Parts/PlantioPart";
import PlantioButtons from "../../PlantiosButtons";
import StatusDoPlantio from "../../StatusDoPlantio";
import { normalizar } from "../../../utils/funcoes";
import SafService from "../../../services/SafService";
import ComunidadeService from "../../../services/ComunidadeService";
import ProprietarioService from "../../../services/ProprietarioService";

interface PlantioFormProps {
  plantio: IPlantioCompleto;
  onProximo: (dados: IPlantioCompleto) => void;
  onCancel: () => void;
}

export default function PlantioCompletoForm({ plantio, onProximo, onCancel }: PlantioFormProps) {
  const [dados, setDados] = useState<IPlantioCompleto>(() => ({
    ...plantio,
    Cliente: normalizar(plantio.Cliente),
    Comunidade: normalizar(plantio.Comunidade),
    Proprietario_Responsavel: normalizar(plantio.Proprietario_Responsavel),
    SAFs: normalizar(plantio.SAFs),
  }));

  const [safExiste, setSafExiste] = useState(true);
  const [comunidadeExiste, setComunidadeExiste] = useState(true);
  const [proprietarioExiste, setProprietarioExiste] = useState(true);

  const [plantioJaCriado, setPlantioJaCriado] = useState(false);
  const [verificando, setVerificando] = useState(false);

  const {
    criarPlantio,
    resetStatus,
    loadingPlantio,
    errorPlantio,
    plantioCriado
  } = useCriaPlantio();

  useEffect(() => {
    resetStatus();
    setDados({
      ...plantio,
      Cliente: normalizar(plantio.Cliente),
      Comunidade: normalizar(plantio.Comunidade),
      Proprietario_Responsavel: normalizar(plantio.Proprietario_Responsavel),
      SAFs: normalizar(plantio.SAFs),
    });
    setPlantioJaCriado(false);
  }, [plantio]);

  const verificarEntidades = async () => {
    setVerificando(true);
    try {
      const [saf, comunidade, produtor] = await Promise.all([
        SafService.verificarSaf(normalizar(dados.SAFs)),
        ComunidadeService.verificarComunidade(normalizar(dados.Comunidade)),
        ProprietarioService.verificarProprietarioPorNome(normalizar(dados.Proprietario_Responsavel))
      ]);

      setSafExiste(!!saf?.id);
      setComunidadeExiste(!!comunidade?.id);
      setProprietarioExiste(!!produtor?.id);

      if (saf?.id && comunidade?.id && produtor?.id) {
        const payload: IPlantio = {
          clienteId: dados.ID_Cliente,
          safId: saf.id,
          comunidadeId: comunidade.id,
          proprietarioId: produtor.id,
          anoCompensacao: dados.Ano,
          tCO2Compensadas: Number(dados.tCO2compensadas || 0),
          numeroArvores: dados.Arvores,
          areaM2: dados.Area_m2,
        };

        const existe = await PlantioService.verificarPlantioRemoto(payload);
        setPlantioJaCriado(existe);

        if (!existe) {
          const sucesso = await criarPlantio(payload);
          if (sucesso) {
            onProximo({ ...dados, safId: saf.id, comunidadeId: comunidade.id, proprietarioId: produtor.id });
          }
        } else {
          onProximo({ ...dados, safId: saf.id, comunidadeId: comunidade.id, proprietarioId: produtor.id });
        }
      }
    } catch (err) {
      console.error("Erro ao verificar/criar plantio:", err);
    } finally {
      setVerificando(false);
    }
  };

  useEffect(() => {
    verificarEntidades();
  }, [dados]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-[1100px] mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Confirme os dados do plantio</h2>
      <div className="flex gap-6 items-start">
        <div className="w-[60%] bg-white rounded-xl shadow-md p-6 border">
          <form className="grid grid-cols-2 gap-4">
            <ClientPart cliente_id={dados.ID_Cliente} cliente={dados.Cliente} />
            <SAFPart SAF={dados.SAFs} longitude={dados.Coord_x} latitude={dados.Coord_y} safExiste={safExiste} recarregarEntidades={verificarEntidades} />
            <ComunidadePart comunidade={dados.Comunidade} comunidadeExiste={comunidadeExiste} recarregarEntidades={verificarEntidades} />
            <ProdutorPart produtor={dados.Proprietario_Responsavel} produtorExiste={proprietarioExiste} recarregarEntidades={verificarEntidades} />
            <PlantioPart dados={dados} handleChange={handleChange} />
            <div className="col-span-2 flex justify-between items-center">
              {verificando && <span className="text-blue-600">Verificando dados...</span>}
              <PlantioButtons onVoltar={onCancel} onProximo={() => { }} loading={loadingPlantio} disabled={verificando} />
            </div>
          </form>
        </div>
        <div className="w-[40%] bg-white rounded-xl shadow-md p-6 border h-fit">
          <StatusDoPlantio
            plantioJaCriado={plantioJaCriado}
            errorPlantio={errorPlantio}
            plantioCriado={plantioCriado}
            onResetErro={resetStatus}
          />
        </div>
      </div>
    </div>
  );
}
