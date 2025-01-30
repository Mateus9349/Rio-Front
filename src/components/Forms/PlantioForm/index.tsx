import React from "react";
import { useForm } from "react-hook-form";
import { IPlantio } from "../../../interfaces/plantio.interface";
import styles from "./PlantioForm.module.scss"; // Importando o SCSS

import { clientesMock } from "../../../interfaces/cliente.interface";
import { safsMock } from "../../../interfaces/SAF.interface";
import { comunidadesMock } from "../../../interfaces/comunidade.interface";
import { proprietariosMock } from "../../../interfaces/proprietario.interface";

interface PlantioFormProps {
  initialData?: IPlantio;
  onSubmit: (data: IPlantio) => void;
}

export const PlantioForm: React.FC<PlantioFormProps> = ({ initialData, onSubmit }) => {
  const { register, handleSubmit } = useForm<IPlantio>({ defaultValues: initialData });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h2>Cadastro de Plantio</h2>

      {/* Cliente */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Cliente:</label>
          <select {...register("clienteId")}>
            <option value="">Selecione um cliente</option>
            {clientesMock.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SAF */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>SAF:</label>
          <select {...register("safId")}>
            <option value="">Selecione um SAF</option>
            {safsMock.map((saf) => (
              <option key={saf.id} value={saf.id}>
                {saf.identificacao} (Lat: {saf.latitude}, Lng: {saf.longitude})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comunidade */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Comunidade:</label>
          <select {...register("comunidadeId")}>
            <option value="">Selecione uma comunidade</option>
            {comunidadesMock.map((comunidade) => (
              <option key={comunidade.id} value={comunidade.id}>
                {comunidade.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Proprietário */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Proprietário:</label>
          <select {...register("proprietarioId")}>
            <option value="">Selecione um proprietário</option>
            {proprietariosMock.map((proprietario) => (
              <option key={proprietario.id} value={proprietario.id}>
                {proprietario.nome} {proprietario.telefone ? `(${proprietario.telefone})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ano de Compensação */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Ano de Compensação:</label>
          <input type="number" {...register("anoCompensacao")} placeholder="Ano" />
        </div>
      </div>

      {/* tCO2 Compensadas */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>tCO2 Compensadas:</label>
          <input type="number" step="any" {...register("tCO2Compensadas")} placeholder="tCO2" />
        </div>
      </div>

      {/* Número de Árvores */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Número de Árvores:</label>
          <input type="number" {...register("numeroArvores")} placeholder="Nº de Árvores" />
        </div>
      </div>

      {/* Área em m² */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Área em m²:</label>
          <input type="number" step="any" {...register("areaM2")} placeholder="Área (m²)" />
        </div>
      </div>

      {/* Botão de Enviar */}
      <button type="submit" className={styles.submitButton}>
        Salvar
      </button>
    </form>
  );
};
