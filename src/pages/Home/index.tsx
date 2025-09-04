import Banner from "../../components/Banner";
import BotaoHome from "../../components/BotaoHome/BotaoHome";
import styles from "./Home.module.scss";

export default function Home() {
    return (
        <main className={styles.homeContainer}>
            <Banner />

            <div className={styles.buttonsContainer}>
                <BotaoHome title="Registrar Plantio" href="/registrarPlantio"/>
                <BotaoHome title="Clientes" href="/ClientesScreen"/>
                <BotaoHome title="SAFs" href="/SAFsScreen" />
                <BotaoHome title="Comunidades" href="/ComunidadesScreen"/>
                <BotaoHome title="Proprietarios" href="/ProprietariosScreen"/>
                <BotaoHome title="Plantios" href="/PlantiosScreen"/>
            </div>
        </main>
    );
}
