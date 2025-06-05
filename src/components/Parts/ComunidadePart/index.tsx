import { useEffect, useState } from "react";
import useCriarComunidade from "../../../hooks/comunidade/useCriarComunidade";

interface Props {
  comunidade: string;
  onChangeExistencia: (existe: string) => void;
}

export default function ComunidadePart({ comunidade, onChangeExistencia }: Props) {
  const [novaComunidade, setNovaComunidade] = useState(comunidade);
  const [verificando, setVerificando] = useState(true);
  const {
    criarComunidade,
    verificarExistencia,
    loading,
    erro,
    comunidadeCriada,
    comunidadeJaExiste,
  } = useCriarComunidade();

  useEffect(() => {
    setNovaComunidade(comunidade);
    checarExistencia(comunidade);
  }, [comunidade]);

  useEffect(() => {
    if (comunidadeCriada?.id) {
      onChangeExistencia(comunidadeCriada.id);
    }
  }, [comunidadeCriada]);

  const checarExistencia = async (nome: string) => {
    setVerificando(true);
    const id = await verificarExistencia(nome);
    onChangeExistencia(id || '');
    setVerificando(false);
  };

  const handleCriar = async () => {
    await criarComunidade({ nome: novaComunidade });
  };

  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium">Comunidade</label>
      <input
        type="text"
        value={novaComunidade}
        onChange={(e) => setNovaComunidade(e.target.value)}
        className="border rounded p-2"
        disabled={comunidadeJaExiste}
      />

      {!verificando && !comunidadeJaExiste && (
        <button
          onClick={handleCriar}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar Comunidade"}
        </button>
      )}

      {erro && <p className="text-red-500 mt-2">{erro}</p>}
      {comunidadeCriada && !erro && (
        <p className="text-green-600 mt-2">✅ Comunidade cadastrada com sucesso!</p>
      )}
    </div>
  );
}
