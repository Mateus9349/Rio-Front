import React from "react";
import { useForm } from "react-hook-form";
import { ICliente } from "../../../interfaces/cliente.interface";
import styles from "./ClienteForm.module.scss"; // Importando o SCSS

interface ClienteFormProps {
    initialData?: ICliente;
    onSubmit: (data: ICliente) => void;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({ initialData, onSubmit }) => {
    const { register, handleSubmit } = useForm<ICliente>({ defaultValues: initialData });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            <h2>Cadastro de Cliente</h2>

            <div className={styles.formGroup}>
                <label>ID:</label>
                <input
                    {...register("id")}
                    placeholder="ID do Cliente"
                    disabled
                />
            </div>

            <div className={styles.formGroup}>
                <label>Nome:</label>
                <input
                    {...register("nome")}
                    placeholder="Nome do Cliente"
                />
            </div>

            <button type="submit" className={styles.submitButton}>
                Salvar
            </button>
        </form>
    );
};
