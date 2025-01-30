import { useNavigate } from "react-router-dom";
import Banner from "../../components/Banner";
import styles from "./Home.module.scss"; // Importando o SCSS

export default function Home() {
    const navigate = useNavigate();

    return (
        <main className={styles.homeContainer}>
            <Banner />

            <div className={styles.buttonsContainer}>
                <button className={styles.navButton} onClick={() => navigate('/cadastros')}>
                    Cadastros
                </button>

                <button className={styles.navButton} onClick={() => navigate('/plantio')}>
                    Plantio
                </button>
            </div>
        </main>
    );
}
