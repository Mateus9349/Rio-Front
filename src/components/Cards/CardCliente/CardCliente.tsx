import { ICliente } from "../../../interfaces/cliente.interface";
import IMAGEM_PADRAO from "../../../assets/img/eu-sou-exibicao-masculino.png";
import styles from './CardCliente.module.scss';

interface CardClienteProps {
    cliente: ICliente;
}

function extrairIdDrive(url: string): string | null {
    const match = url.match(/\/file\/d\/(.*?)\//);
    return match ? match[1] : null;
}

export default function CardCliente({ cliente }: CardClienteProps) {
    const imagem = cliente.imagem && cliente.imagem.trim() !== "" ? cliente.imagem : IMAGEM_PADRAO;
    const nomeLimpo = cliente.nome.replace(/\s*\(.*?\)\s*/g, "").trim();

    const isGoogleDrive = imagem.includes("drive.google.com");
    const driveId = isGoogleDrive ? extrairIdDrive(imagem) : null;
    const driveUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : null;

    return (
        <div className={styles.container}>
            {driveUrl ? (
                <iframe
                    src={driveUrl}
                    title={nomeLimpo}
                    className={styles.img}
                    allow="autoplay"
                />
            ) : (
                <img
                    src={imagem}
                    alt={nomeLimpo}
                    className={styles.img}
                />
            )}

            <p className={styles.text}>{nomeLimpo}</p>
        </div>
    );
}
