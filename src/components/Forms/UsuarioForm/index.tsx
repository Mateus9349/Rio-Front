import React from "react";
import { useForm } from "react-hook-form";
import { IUsuario } from "../../../interfaces/user.interface";
import styles from "./UsuarioForm.module.scss"; // Importando o SCSS

interface UsuarioFormProps {
    initialData?: IUsuario;
    onSubmit: (data: IUsuario) => void;
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ initialData, onSubmit }) => {
    const { register, handleSubmit } = useForm<IUsuario>({ defaultValues: initialData });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            <h2>Cadastro de Usuário</h2>

            <div className={styles.formGroup}>
                <label>Nome:</label>
                <input {...register("nome")} placeholder="Nome do Usuário" />
            </div>

            <div className={styles.formGroup}>
                <label>Email:</label>
                <input type="email" {...register("email")} placeholder="Email" />
            </div>

            <div className={styles.formGroup}>
                <label>Senha:</label>
                <input type="password" {...register("senhaHash")} placeholder="Senha" />
            </div>

            <button type="submit" className={styles.submitButton}>
                Salvar
            </button>
        </form>
    );
};
