interface Props {
    dados: any; // Tipar corretamente se possível
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PlantioPart({ dados, handleChange }: Props) {
    return (
        <>
            {/* Ano */}
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Ano</label>
                <input
                    type="number"
                    name="Ano"
                    value={dados.Ano}
                    onChange={handleChange}
                    className="border rounded p-2"
                />
            </div>

            {/* tCO2 Compensadas */}
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium">tCO2 Compensadas</label>
                <input
                    type="number"
                    name="tCO2compensadas"
                    value={dados.tCO2compensadas === '' ? 0 : dados.tCO2compensadas}
                    onChange={handleChange}
                    className="border rounded p-2"
                />
            </div>

            {/* Árvores */}
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Árvores</label>
                <input
                    type="number"
                    name="Arvores"
                    value={dados.Arvores}
                    onChange={handleChange}
                    className="border rounded p-2"
                />
            </div>

            {/* Área (m²) */}
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Área (m²)</label>
                <input
                    type="number"
                    name="Area_m2"
                    value={dados.Area_m2}
                    onChange={handleChange}
                    className="border rounded p-2"
                />
            </div>
        </>
    )
}