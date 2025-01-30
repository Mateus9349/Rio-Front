import React from "react";
import { useForm } from "react-hook-form";
import { ISAF } from "../../../interfaces/SAF.interface";
import styles from "./SAFForm.module.scss"; // Importando o SCSS

interface SAFFormProps {
    initialData?: ISAF;
    onSubmit: (data: ISAF) => void;
}

export const SAFForm: React.FC<SAFFormProps> = ({ initialData, onSubmit }) => {
    const { register, handleSubmit } = useForm<ISAF>({ defaultValues: initialData });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            <h2>Cadastro de SAF</h2>

            <div className={styles.formGroup}>
                <label>Identificação:</label>
                <input {...register("identificacao")} placeholder="Identificação SAF" />
            </div>

            <div className={styles.formGroup}>
                <label>Latitude:</label>
                <input type="number" step="any" {...register("latitude")} placeholder="Latitude" />
            </div>

            <div className={styles.formGroup}>
                <label>Longitude:</label>
                <input type="number" step="any" {...register("longitude")} placeholder="Longitude" />
            </div>

            <button type="submit" className={styles.submitButton}>
                Salvar
            </button>
        </form>
    );
};
