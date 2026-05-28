import type { ICertificado } from "../../../interfaces/certificado.interface";

interface Props {
    dados: ICertificado;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PlantioPart({ dados, handleChange }: Props) {
    return (
        <fieldset className="col-span-2 border border-gray-300 rounded-lg p-4">
            <legend className="px-2 text-sm font-medium text-gray-700">Informações do Plantio</legend>
            {/* Código */}
            <div className="flex flex-col w-50 text-center justify-self-center">
                <label className="text-gray-800 font-bold">Código</label>
                <input
                    type="text"
                    name="Codigo"
                    value={dados.codigo}
                    onChange={handleChange}
                    className="border rounded p-2"
                />
            </div>

            <div className="flex flex-col grid grid-cols-2 gap-4">
                {/* Ano */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Ano</label>
                    <input
                        type="number"
                        name="Ano"
                        value={dados.ano}
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
                        value={dados.tco2Compensadas}
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
                        value={dados.arvores}
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
                        value={dados.areaM2}
                        onChange={handleChange}
                        className="border rounded p-2"
                    />
                </div>
            </div>
        </fieldset>
    )
}