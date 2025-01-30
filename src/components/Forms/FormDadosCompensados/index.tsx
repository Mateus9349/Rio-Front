import { useState, useEffect } from 'react';
import styles from './FormDadosCompensados.module.scss';
import { IDadosCompensados } from '../../../interfaces/dadosCompensados.interface';

interface Props {
    dadosIniciais?: IDadosCompensados;
}

export default function FormDadosCompensados({ dadosIniciais }: Props) {
    const dadosPadrao: IDadosCompensados = {
        areaHa: 0,
        layer: '',
        proprietario: '',
        comunidade: '',
        xCentroid: 0,
        y: 0,
        numeroSAF: 0,
        coordenadas: [0, 0, 0]
    };

    const [formData, setFormData] = useState<IDadosCompensados>(dadosIniciais || dadosPadrao);

    // Atualiza o estado quando os dados iniciais mudam
    useEffect(() => {
        if (dadosIniciais) {
            setFormData(dadosIniciais);
        }
    }, [dadosIniciais]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        // Se for um número, converter para tipo numérico
        const newValue = isNaN(Number(value)) ? value : Number(value);

        setFormData(prev => ({
            ...prev,
            [id]: newValue
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Dados salvos:', formData);
    };

    return (
        <div className={styles.formContainer}>
            <h2>Inserir Dados de Plantio</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Área (ha)</label>
                        <input type="number" id="areaHa" value={formData.areaHa} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Layer</label>
                        <input type="text" id="layer" value={formData.layer} onChange={handleChange} required />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Proprietário</label>
                        <input type="text" id="proprietario" value={formData.proprietario} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Comunidade</label>
                        <input type="text" id="comunidade" value={formData.comunidade} onChange={handleChange} required />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>X Centroid</label>
                        <input type="number" id="xCentroid" value={formData.xCentroid} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Y</label>
                        <input type="number" id="y" value={formData.y} onChange={handleChange} required />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Número SAF</label>
                        <input type="number" id="numeroSAF" value={formData.numeroSAF} onChange={handleChange} required />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Longitude</label>
                        <input type="number" id="longitude" value={formData.coordenadas[0]} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Latitude</label>
                        <input type="number" id="latitude" value={formData.coordenadas[1]} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Altitude</label>
                        <input type="number" id="altitude" value={formData.coordenadas[2]} onChange={handleChange} required />
                    </div>
                </div>

                <button className={styles.button} type="submit">Salvar</button>
            </form>
        </div>
    );
}
