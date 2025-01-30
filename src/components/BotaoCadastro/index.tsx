import styles from "./BotaoCadastro.module.scss"; // Importando o SCSS

interface Props {
    text: string;
    onClick: () => void;
}

export default function BotaoCadastro({ text, onClick }: Props) {
    return (
        <button onClick={onClick} className={styles.botaoCadastro}>
            {text}
        </button>
    );
}
