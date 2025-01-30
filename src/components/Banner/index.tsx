import styles from "./Banner.module.scss"; // Importando o SCSS

export default function Banner() {
    return (
        <section className={styles.bannerContainer}>
            <h1>Sistema de Inserção de Dados</h1>
            <h2>Mapa de Plantio</h2>
        </section>
    );
}
