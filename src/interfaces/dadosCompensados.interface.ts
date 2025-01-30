export interface IDadosCompensados {
    areaHa: number;
    layer: string;
    proprietario: string;
    comunidade: string;
    xCentroid: number;
    y: number;
    numeroSAF: number;
    coordenadas: [number, number, number]; // [longitude, latitude, altitude]
}