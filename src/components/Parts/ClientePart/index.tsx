import { useState, useEffect } from "react";
import ClienteService from "../../../services/ClienteService";
import { normalizar } from "../../../utils/funcoes";

interface Props {
  cliente_id: string;
  cliente: string;
  onChangeExistencia: (existe: string) => void;
}

export default function ClientPart({ cliente_id, cliente, onChangeExistencia }: Props) {
  const [novoCliente, setNovoCliente] = useState<string>(cliente);
  const [loadingCadastro, setLoadingCadastro] = useState<boolean>(false);
  const [erroCadastro, setErroCadastro] = useState<string | null>(null);
  const [clienteExiste, setClienteExiste] = useState<boolean>(true);
  const [verificandoCliente, setVerificandoCliente] = useState<boolean>(true);

  useEffect(() => {
    setNovoCliente(cliente);
    verificarCliente();
  }, [cliente_id]);

  const verificarCliente = async () => {
    setVerificandoCliente(true);
    try {
      const clienteEncontrado = await ClienteService.buscarCliente(normalizar(cliente_id));
      const existe = !!clienteEncontrado?.id;
      setClienteExiste(existe);
      onChangeExistencia(clienteEncontrado?.id || '');
    } catch {
      setClienteExiste(false);
      onChangeExistencia('');
    } finally {
      setVerificandoCliente(false);
    }
  };

  const cadastrarCliente = async () => {
    try {
      setLoadingCadastro(true);
      await ClienteService.criarCliente({
        id: cliente_id,
        nome: normalizar(novoCliente),
      });
      setClienteExiste(true);
      setErroCadastro(null);
      onChangeExistencia(cliente_id);
    } catch {
      setErroCadastro("Erro ao cadastrar o cliente.");
    } finally {
      setLoadingCadastro(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">ID Cliente</label>
        <input
          type="text"
          name="ID_Cliente"
          value={cliente_id}
          className="border rounded p-2"
          readOnly
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Cliente</label>
        <input
          type="text"
          name="Cliente"
          value={novoCliente}
          onChange={(e) => setNovoCliente(e.target.value)}
          className="border rounded p-2"
          disabled={clienteExiste}
        />
      </div>

      {!verificandoCliente && !clienteExiste && (
        <div className="mt-2">
          <p className="text-red-500">Cliente não cadastrado.</p>
          <button
            onClick={cadastrarCliente}
            disabled={loadingCadastro}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            {loadingCadastro ? "Cadastrando..." : "Cadastrar Cliente"}
          </button>
        </div>
      )}

      {erroCadastro && <p className="text-red-500 mt-2">{erroCadastro}</p>}
    </div>
  );
}
