import { useEffect, useState } from "react";
import Banner from "../../components/Banner";
import FormDadosCompensados from "../../components/Forms/FormDadosCompensados";
import ProcessarKML from "../../components/ProcessaDados";
import { IDadosCompensados } from "../../interfaces/dadosCompensados.interface";

export default function InserirDados() {
    const [dadosCompensados, setDadosCompensados] = useState<IDadosCompensados | undefined>(undefined);

    const handleDados = (dados: IDadosCompensados) => {
        setDadosCompensados(dados);
        console.log(dados)
    }

    useEffect(() => {

    }, [dadosCompensados])

    return (
        <main>
            <Banner />

            <ProcessarKML
                passaDados={handleDados}
            />

            <FormDadosCompensados
                dadosIniciais={dadosCompensados}
            />
        </main>
    )
}