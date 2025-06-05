import { useState, useEffect } from "react";
import useCriarSaf from "../../../hooks/Safs/useCriarSaf";
import { normalizar } from "../../../utils/funcoes";

interface Props {
  SAF: string;
  longitude: number;
  latitude: number;
  onChangeExistencia: (existe: string) => void;
}

export default function SAFPart({ SAF, longitude, latitude, onChangeExistencia }: Props) {
  const [novoSaf, setNovoSaf] = useState<string>(SAF);
  const [verificandoSaf, setVerificandoSaf] = useState<boolean>(true);
  const {
    criarSaf,
    verificarExistencia,
    loading,
    erro,
    safCriado,
    safJaExiste
  } = useCriarSaf();

  useEffect(() => {
    setNovoSaf(SAF);
    checarExistencia(SAF);
  }, [SAF]);

  useEffect(() => {
    if (safCriado?.id) {
      onChangeExistencia(safCriado.id);
    }
  }, [safCriado]);

  const checarExistencia = async (identificacao: string) => {
    setVerificandoSaf(true);
    const id = await verificarExistencia(normalizar(identificacao));
    onChangeExistencia(id || '');
    setVerificandoSaf(false);
  };

  const handleCriar = async () => {
    await criarSaf({
      identificacao: normalizar(novoSaf),
      latitude: Number(latitude || 0),
      longitude: Number(longitude || 0),
    });
  };

  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium">Número do SAF</label>
      <input
        type="text"
        value={novoSaf}
        onChange={(e) => setNovoSaf(e.target.value)}
        className="border rounded p-2"
        disabled={safJaExiste}
      />

      <label className="text-gray-700 font-medium mt-2">Latitude</label>
      <input type="number" value={latitude} className="border rounded p-2" disabled />

      <label className="text-gray-700 font-medium mt-2">Longitude</label>
      <input type="number" value={longitude} className="border rounded p-2" disabled />

      {!verificandoSaf && !safJaExiste && (
        <button
          onClick={handleCriar}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar SAF"}
        </button>
      )}

      {erro && <p className="text-red-500 mt-2">{erro}</p>}

      {safCriado && !erro && !safJaExiste && (
        <p className="text-green-500 mt-2">✅ SAF cadastrado com sucesso!</p>
      )}
    </div>
  );
}
