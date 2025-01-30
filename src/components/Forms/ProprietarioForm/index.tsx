import React from "react";
import { useForm } from "react-hook-form";
import { IProprietario } from "../../../interfaces/proprietario.interface";
import styles from "./ProprietarioForm.module.scss"; // Importando o SCSS

interface ProprietarioFormProps {
    initialData?: IProprietario;
    onSubmit: (data: IProprietario) => void;
}

export const ProprietarioForm: React.FC<ProprietarioFormProps> = ({ initialData, onSubmit }) => {
    const { register, handleSubmit } = useForm<IProprietario>({ defaultValues: initialData });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            <h2>Cadastro de Proprietário</h2>

            <div className={styles.formGroup}>
                <label>Nome:</label>
                <input {...register("nome")} placeholder="Nome do Proprietário" />
            </div>

            <div className={styles.formGroup}>
                <label>Telefone:</label>
                <input {...register("telefone")} placeholder="Telefone" />
            </div>

            <div className={styles.formGroup}>
                <label>Email:</label>
                <input type="email" {...register("email")} placeholder="Email" />
            </div>

            <button type="submit" className={styles.submitButton}>
                Salvar
            </button>
        </form>
    );
};
