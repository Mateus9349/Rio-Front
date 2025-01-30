import Banner from "../../components/Banner";
import { PlantioForm } from "../../components/Forms/PlantioForm";
import styles from "./Plantio.module.scss"; // Importando o SCSS

export default function Plantio() {
    return (
        <main className={styles.plantioContainer}>
            <Banner />

            <div className={styles.formContainer}>
                <PlantioForm onSubmit={() => ''} />
            </div>
        </main>
    );
}
