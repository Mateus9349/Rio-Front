export interface IPlantio {
    id?: string;
    clienteId: string;
    safId: string;
    comunidadeId: string;
    proprietarioId: string;
    anoCompensacao: number;
    tCO2Compensadas: number;
    numeroArvores: number;
    areaM2: number;
    imagens?: string[];
}

export const plantiosMock: IPlantio[] = [
    {
        id: "1",
        clienteId: "1",
        safId: "1",
        comunidadeId: "1",
        proprietarioId: "1",
        anoCompensacao: 2024,
        tCO2Compensadas: 12.5,
        numeroArvores: 150,
        areaM2: 200.5
    },
    {
        id: "2",
        clienteId: "2",
        safId: "2",
        comunidadeId: "2",
        proprietarioId: "2",
        anoCompensacao: 2023,
        tCO2Compensadas: 10.2,
        numeroArvores: 120,
        areaM2: 180.0
    },
    {
        id: "3",
        clienteId: "3",
        safId: "3",
        comunidadeId: "3",
        proprietarioId: "3",
        anoCompensacao: 2025,
        tCO2Compensadas: 15.0,
        numeroArvores: 180,
        areaM2: 220.3
    }
];
