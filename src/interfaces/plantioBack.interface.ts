export interface IPlantioBack {
    id: string;
    anoCompensacao: number;
    tCO2Compensadas: number | string;
    numeroArvores: number;
    areaM2: number | string;
    imagens?: string[];

    cliente: {
        id: string;
        nome: string;
    };

    saf: {
        id: string;
        identificacao: string;
        latitude?: string;
        longitude?: string;
        imagens?: string[];
    };

    comunidade: {
        id: string;
        nome: string;
    };

    proprietario: {
        id: string;
        nome: string;
        telefone?: string;
        email?: string;
    };
}
