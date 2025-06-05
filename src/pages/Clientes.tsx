import CardCliente from "../components/Cards/CardCliente/CardCliente";
import useClientes from "../hooks/clientes/useClientes";

export default function Clientes() {
  const { clientes, loadingCliente, erroCliente } = useClientes();

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Clientes Cadastrados</h1>

      {loadingCliente && <p className="text-gray-600">Carregando clientes...</p>}
      {erroCliente && <p className="text-red-500">Erro: {erroCliente.message}</p>}

      <div className="flex flex-wrap gap-6">
        {clientes.map((cliente) => (
          <CardCliente key={cliente.id} cliente={cliente} />
        ))}
      </div>
    </div>
  );
}
