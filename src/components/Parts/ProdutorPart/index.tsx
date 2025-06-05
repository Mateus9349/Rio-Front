import { useEffect, useState } from "react";
import useCriarProprietario from "../../../hooks/proprietario/useCriarProprietario";

interface Props {
  produtor: string;
  onChangeExistencia: (existe: string) => void;
}

export default function ProdutorPart({ produtor, onChangeExistencia }: Props) {
  const [novoProdutor, setNovoProdutor] = useState(produtor);
  const [verificando, setVerificando] = useState(true);

  const {
    criarProprietario,
    verificarExistencia,
    loading,
    erro,
    proprietarioCriado,
    proprietarioJaExiste,
  } = useCriarProprietario();

  useEffect(() => {
    setNovoProdutor(produtor);
    checarExistencia(produtor);
  }, [produtor]);

  useEffect(() => {
    if (proprietarioCriado?.id) {
      onChangeExistencia(proprietarioCriado.id);
    }
  }, [proprietarioCriado]);

  const checarExistencia = async (nome: string) => {
    setVerificando(true);
    const id = await verificarExistencia(nome);
    onChangeExistencia(id || '');
    setVerificando(false);
  };

  const handleCriar = async () => {
    await criarProprietario({ nome: novoProdutor });
  };

  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium">Proprietário/Responsável</label>
      <input
        type="text"
        value={novoProdutor}
        onChange={(e) => setNovoProdutor(e.target.value)}
        className="border rounded p-2"
        disabled={proprietarioJaExiste}
      />

      {!verificando && !proprietarioJaExiste && (
        <button
          onClick={handleCriar}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar Proprietário"}
        </button>
      )}

      {erro && <p className="text-red-500 mt-2">{erro}</p>}
      {proprietarioCriado && !erro && (
        <p className="text-green-600 mt-2">✅ Proprietário cadastrado com sucesso!</p>
      )}
    </div>
  );
}
