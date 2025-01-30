import React from "react";
import { useForm } from "react-hook-form";
import { IComunidade } from "../../../interfaces/comunidade.interface";
import styles from "./ComunidadeForm.module.scss"; // Importando o SCSS

interface ComunidadeFormProps {
    initialData?: IComunidade;
    onSubmit: (data: IComunidade) => void;
}

export const ComunidadeForm: React.FC<ComunidadeFormProps> = ({ initialData, onSubmit }) => {
    const { register, handleSubmit } = useForm<IComunidade>({ defaultValues: initialData });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            <h2>Cadastro de Comunidade</h2>

            <div className={styles.formGroup}>
                <label>Nome da Comunidade:</label>
                <input {...register("nome")} placeholder="Nome da Comunidade" />
            </div>

            <button type="submit" className={styles.submitButton}>
                Salvar
            </button>
        </form>
    );
};
