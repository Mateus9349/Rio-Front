import { useState } from "react";
import Banner from "../../components/Banner";
import BotaoCadastro from "../../components/BotaoCadastro";
import { ClienteForm } from "../../components/Forms/ClienteForm";
import { SAFForm } from "../../components/Forms/SAFForm";
import { ComunidadeForm } from "../../components/Forms/ComunidadeForm";
import { ProprietarioForm } from "../../components/Forms/ProprietarioForm";
import styles from "./Cadastros.module.scss"; // Importando o SCSS

export default function Cadastros() {
    const [showForm, setShowForm] = useState<"" | "cliente" | "saf" | "comunidade" | "proprietario">("");

    return (
        <main className={styles.cadastrosContainer}>
            <Banner />

            <div className={styles.buttonsContainer}>
                <BotaoCadastro text="Cliente" onClick={() => setShowForm("cliente")} />
                <BotaoCadastro text="SAF" onClick={() => setShowForm("saf")} />
                <BotaoCadastro text="Comunidade" onClick={() => setShowForm("comunidade")} />
                <BotaoCadastro text="Proprietário" onClick={() => setShowForm("proprietario")} />
            </div>

            <div className={styles.formContainer}>
                {showForm === "cliente" && <ClienteForm onSubmit={() => ""} />}
                {showForm === "saf" && <SAFForm onSubmit={() => ""} />}
                {showForm === "comunidade" && <ComunidadeForm onSubmit={() => ""} />}
                {showForm === "proprietario" && <ProprietarioForm onSubmit={() => ""} />}
            </div>
        </main>
    );
}
