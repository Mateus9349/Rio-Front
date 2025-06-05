import Banner from "../../components/Banner";
import BotaoHome from "../../components/BotaoHome/BotaoHome";
import styles from "./Home.module.scss";

export default function Home() {
    return (
        <main className={styles.homeContainer}>
            <Banner />

            <div className={styles.buttonsContainer}>
                <BotaoHome title="Registrar Plantio" href="/registrarPlantio"/>
                <BotaoHome title="Clientes" href="/Clientes"/>
                <BotaoHome title="SAFs" href="/SAFs" />
                <BotaoHome title="Comunidades" href="/Comunidades"/>
                <BotaoHome title="Proprietarios" href="/Proprietarios"/>
                <BotaoHome title="Plantios" href="/plantios"/>
            </div>
        </main>
    );
}
