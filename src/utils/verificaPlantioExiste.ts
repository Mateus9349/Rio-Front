// utils/verificaPlantioExisteMemoria.ts
import { IPlantio } from "../interfaces/plantio.interface";

function normalizarNumero(valor: number | string): number {
    const num = parseFloat(String(valor));
    return isNaN(num) ? 0 : parseFloat(num.toFixed(2));
}

export function verificaPlantioExisteMemoria(novo: IPlantio, plantios: IPlantio[]) {
    return plantios.some((p) =>
        p.clienteId === novo.clienteId &&
        p.safId === novo.safId &&
        p.comunidadeId === novo.comunidadeId &&
        p.proprietarioId === novo.proprietarioId &&
        p.anoCompensacao === novo.anoCompensacao &&
        normalizarNumero(p.tCO2Compensadas) === normalizarNumero(novo.tCO2Compensadas) &&
        p.numeroArvores === novo.numeroArvores &&
        normalizarNumero(p.areaM2) === normalizarNumero(novo.areaM2)
    );
}
