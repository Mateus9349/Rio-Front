// components/CabecalhoMapa.tsx
export default function CabecalhoMapa() {
    return (
        <div className="bg-green-500 text-white py-10">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h1 className="text-3xl font-bold mb-6">Mapa de Plantio</h1>
                <div className="bg-white text-gray-700 rounded-md px-6 py-4 shadow-md">
                    <p className="mb-2">
                        Mapa de Plantio dos parceiros do Programa Carbono Neutro Idesam.
                        O plantio é realizado na Reserva de Desenvolvimento Sustentável do Uatumã (Amazonas)
                        em Sistemas Agroflorestais.
                    </p>
                    <p>
                        Na categoria de compensação das emissões de carbono, acesse sua área específica,
                        inserindo o código informado no seu certificado.
                    </p>
                </div>
            </div>
        </div>
    );
}
