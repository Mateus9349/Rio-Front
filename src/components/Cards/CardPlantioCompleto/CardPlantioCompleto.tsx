import { IPlantioBack } from "../../../interfaces/plantioBack.interface";
import Galeria from "../../Galeria/Galeria";
import styles from './CardPlantioCompleto.module.scss';

interface Props {
    plantio: IPlantioBack | null;
    excluirImagem: (imagem: string) => void;
}

export default function CardPlantioCompleto({ plantio, excluirImagem }: Props) {
    return (
        <div className={styles.container}>
            <div className="flex justify-between max-w-full">
                <h3>Cliente: <span>{plantio?.cliente.nome}</span></h3>
                <h3>Ano: <span>{plantio?.anoCompensacao}</span></h3>
            </div>

            <div className="flex justify-between max-w-full">
                <h3>Proprietario: <span>{plantio?.proprietario.nome}</span></h3>
                <h3>Comunidade: <span>{plantio?.comunidade.nome}</span></h3>
                <h3>SAF: <span>{plantio?.saf.identificacao}</span></h3>
            </div>

            <div className="flex justify-between max-w-full">
                <h3>Árvores: <span>{plantio?.numeroArvores}</span></h3>
                <h3>tCO2: <span>{plantio?.tCO2Compensadas}</span></h3>
            </div>

            <Galeria imagens={plantio?.imagens} excluirImagem={excluirImagem}/>
        </div>
    )
}