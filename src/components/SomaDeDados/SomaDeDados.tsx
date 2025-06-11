interface Props {
    totais: {
        arvores: number,
        carbono: number,
        area: number
    }
}

export default function SomaDeDados({ totais }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 text-center mb-6">
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-2xl font-bold">
                    {totais.arvores.toLocaleString('pt-BR')}
                </h2>
                <h3 className="text-sm text-gray-600">Árvores Plantadas</h3>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-2xl font-bold">
                    {totais.carbono.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                    })}{' '}
                    t
                </h2>
                <h3 className="text-sm text-gray-600">Emissões Compensadas</h3>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-2xl font-bold">
                    {totais.area.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                    })}{' '}
                    ha
                </h2>
                <h3 className="text-sm text-gray-600">Área Reflorestada</h3>
            </div>
        </div>
    )
}