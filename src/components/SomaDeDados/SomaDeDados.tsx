interface Props {
    totais: {
        arvores: number,
        carbono: number,
        area: number
    }
}

export default function SomaDeDados({ totais }: Props) {
    return (
        <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg flex flex-wrap justify-between gap-4 text-center">
            <div className="flex-1 min-w-[150px]">
                <h2 className="text-2xl font-bold">
                    {totais.arvores.toLocaleString('pt-BR')}
                </h2>
                <h3 className="text-sm">Árvores Plantadas</h3>
            </div>

            <div className="flex-1 min-w-[150px]">
                <h2 className="text-2xl font-bold">
                    {totais.carbono.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                    })}{' '}
                    TCO²
                </h2>
                <h3 className="text-sm">Emissões Compensadas</h3>
            </div>

            <div className="flex-1 min-w-[150px]">
                <h2 className="text-2xl font-bold">
                    {totais.area.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                    })}{' '}
                    M²
                </h2>
                <h3 className="text-sm">Área Reflorestada</h3>
            </div>
        </div>
    );
}
