export interface IPlantioCompleto {
    ID_Cliente: string;
    Cliente: string;
    Ano: number;
    tCO2compensadas: number;
    Arvores: number;
    Area_m2: number;
    SAFs: string;
    Coord_x: number;
    Coord_y: number;
    Comunidade: string;
    Proprietario_Responsavel: string;

    // Adicione os IDs opcionais que serão injetados dinamicamente
    safId?: string;
    comunidadeId?: string;
    proprietarioId?: string;
}
