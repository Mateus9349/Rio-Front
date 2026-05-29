import { useState } from "react";
import CardCliente from "../components/Cards/CardCliente/CardCliente";
import { useClientes } from "../hooks/clientes/useClientes";
import BotaoCadastro from "../components/BotaoCadastro";
import FormAtualizaCliente from "../components/FormAtualizaCliente/FormAtualizaCliente";

type View = "list" | "edit" | "image";

export default function Clientes() {
  const {
    clientes = [],
    erroClientes,
    loadingClientes,
    refetchClientes
  } = useClientes();

  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [saving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const openFor = (id: number, next: View) => {
    setSelectedId(id);
    setView(next);
    setLocalError(null);
  };

  const voltar = () => {
    setSelectedId(null);
    setView("list");
    setLocalError(null);
  };

  /* const handleAtualizarImagem = async (imagem: string) => {
    if (!selectedId) return;
    try {
      setSaving(true);
      setLocalError(null);
      await atualizarCliente(selectedId, { imagem });
      await refetchClientes();
      voltar();
    } catch (e: any) {
      setLocalError(e?.message ?? "Falha ao atualizar cliente.");
    } finally {
      setSaving(false);
    }
  }; */

  // Early-returns deixam o fluxo previsível
  if (loadingClientes) {
    return (
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Clientes Cadastrados</h1>
        <p className="text-gray-600">Carregando clientes...</p>
      </div>
    );
  }

  if (erroClientes) {
    return (
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Clientes Cadastrados</h1>
        <p className="text-red-500 mb-4">Erro: {erroClientes}</p>
        <BotaoCadastro text="Tentar novamente" onClick={() => refetchClientes()} />
      </div>
    );
  }

  let content: JSX.Element;

  switch (view) {
    case "list":
      content = (
        <div className="flex flex-wrap gap-6">
          {clientes.length === 0 ? (
            <p className="text-gray-600">Nenhum cliente cadastrado.</p>
          ) : (
            clientes.map((cliente) => (
              <div key={cliente.id} className="flex flex-col items-center gap-2">
                <CardCliente cliente={cliente} />
                <h1>{cliente.id}</h1>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer disabled:opacity-50"
                    onClick={() => openFor(cliente.id, "edit")}
                    disabled={saving}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer disabled:opacity-50"
                    onClick={() => openFor(cliente.id, "image")}
                    disabled={saving}
                  >
                    Trocar Imagem
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      );
      break;

    case "image":
      content = (
        <>
          <div className="mt-4">
            <BotaoCadastro text={saving ? "Salvando..." : "Voltar"} onClick={voltar} />
          </div>

          {/* <AdicionarImagens onSubmit={handleAtualizarImagem} /> */}
          {localError && <p className="text-red-500 mt-2">{localError}</p>}
        </>
      );
      break;

    case "edit": {
      const clienteSelecionado = clientes.find((c) => c.id === selectedId);

      if (!clienteSelecionado) {
        content = <p className="text-red-500">Cliente não encontrado.</p>;
        break;
      }

      content = (
        <>
          <div className="mt-4">
            <BotaoCadastro text="Voltar" onClick={voltar} />
          </div>

          <FormAtualizaCliente
            cliente={clienteSelecionado}
            onCancel={voltar}
            onSuccess={async () => {
              // Depois que o form salvar:
              await refetchClientes(); // refaz a lista
              voltar(); // volta para a tela de listagem
            }}
          />
        </>
      );
      break;
    }
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Clientes Cadastrados</h1>
      {content}
    </div>
  );
}
