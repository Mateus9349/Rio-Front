export default function ListaClientessimilares() {
    return (
        <div className="w-full bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-xl font-bold mb-4">Clientes Similares Encontrados</h2>
            <p className="text-gray-600 mb-4">Foram encontrados clientes com nomes semelhantes. Por favor, verifique se algum deles corresponde ao cliente que você deseja cadastrar.</p>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Nome do Cliente</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Aqui você pode mapear os clientes semelhantes encontrados */}
                </tbody>
            </table>
        </div>
    )
}