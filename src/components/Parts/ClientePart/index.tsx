import { useState, useEffect, useCallback } from "react";
import { useClientesPorNome } from "../../../hooks/clientes/useClientesPorNome";
import { ICliente } from "../../../interfaces/cliente.interface";
import { useCreateCliente } from "../../../hooks/clientes/useCreateCliente";

interface Props {
  cliente: string;
  onChangeExistencia: (clienteId: number | null) => void;
}

export default function ClientPart({ cliente, onChangeExistencia }: Props) {
  const [novoCliente, setNovoCliente] = useState<string>(cliente);
  const [loadingCadastro, setLoadingCadastro] = useState<boolean>(false);
  const [erroCadastro, setErroCadastro] = useState<string | null>(null);
  const [clienteExato, setClienteExato] = useState<ICliente | null>(null);
  const [verificandoCliente, setVerificandoCliente] = useState<boolean>(false);
  const [clientesEncontrados, setClientesEncontrados] = useState<ICliente[]>([]);

  const { buscarClientesPorNome } = useClientesPorNome();
  const { criarCliente } = useCreateCliente();

  const normalizarNome = (valor: string) => valor.trim().toLowerCase();

  const verificarCliente = useCallback(async (nomeCliente: string) => {
    if (!nomeCliente.trim()) {
      setClienteExato(null);
      setClientesEncontrados([]);
      onChangeExistencia(null);
      return;
    }

    setVerificandoCliente(true);
    setErroCadastro(null);

    try {
      const clientesEncontradosApi: ICliente[] = await buscarClientesPorNome(nomeCliente);

      const nomeNormalizado = normalizarNome(nomeCliente);

      const clienteEncontradoExatamente = clientesEncontradosApi.find(
        (c) => normalizarNome(c.nome) === nomeNormalizado
      ) || null;

      setClienteExato(clienteEncontradoExatamente);
      setClientesEncontrados(clientesEncontradosApi);

      if (clienteEncontradoExatamente) {
        onChangeExistencia(clienteEncontradoExatamente.id);
      } else {
        onChangeExistencia(null);
      }
    } catch {
      setClienteExato(null);
      setClientesEncontrados([]);
      onChangeExistencia(null);
    } finally {
      setVerificandoCliente(false);
    }
  }, [buscarClientesPorNome]);

  useEffect(() => {
    setNovoCliente(cliente);
    verificarCliente(cliente);
  }, [cliente]);

  const cadastrarCliente = async () => {
    if (!novoCliente.trim()) {
      setErroCadastro("Informe o nome do cliente.");
      return;
    }

    try {
      setLoadingCadastro(true);
      setErroCadastro(null);

      const clienteCriado = await criarCliente({ nome: novoCliente.trim() });

      setClienteExato(clienteCriado);
      if (clienteCriado) {
        onChangeExistencia(clienteCriado.id);
      }

      await verificarCliente(novoCliente.trim());
    } catch {
      setErroCadastro("Erro ao cadastrar o cliente.");
    } finally {
      setLoadingCadastro(false);
    }
  };

  const clienteJaExisteExatamente = !!clienteExato;

  return (
    <div>
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Cliente</label>
        <input
          type="text"
          name="Cliente"
          value={novoCliente}
          onChange={(e) => setNovoCliente(e.target.value)}
          onBlur={() => verificarCliente(novoCliente)}
          className="border rounded p-2"
          disabled={clienteJaExisteExatamente}
        />
      </div>

      {verificandoCliente && (
        <p className="text-gray-500 mt-2">Verificando cliente...</p>
      )}

      {!verificandoCliente && clienteJaExisteExatamente && (
        <div className="mt-2">
          <p className="text-green-600">
            Cliente já cadastrado: {clienteExato.nome} (ID: {clienteExato.id})
          </p>
        </div>
      )}

      {!verificandoCliente &&
        !clienteJaExisteExatamente &&
        novoCliente.trim() && (
          <div className="mt-2">
            <p className="text-amber-600">
              Não existe cliente com esse nome exato.
            </p>
            <button
              onClick={cadastrarCliente}
              disabled={loadingCadastro}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              {loadingCadastro ? "Cadastrando..." : "Cadastrar Cliente"}
            </button>
          </div>
        )}

      {!verificandoCliente &&
        !clienteJaExisteExatamente &&
        clientesEncontrados.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-600">Clientes semelhantes encontrados:</p>
            <ul className="list-disc list-inside">
              {clientesEncontrados.map((c) => (
                <li key={c.id}>
                  {c.nome} (ID: {c.id})
                </li>
              ))}
            </ul>
          </div>
        )}

      {erroCadastro && <p className="text-red-500 mt-2">{erroCadastro}</p>}
    </div>
  );
}