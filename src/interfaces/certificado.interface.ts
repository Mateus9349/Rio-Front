export interface ICertificado {
    id?: string;
    codigo: string;
    ano: number;
    tco2Compensadas: number;
    arvores: number;
    areaM2: number;
    ativo: boolean;
    createdAt?: string;
    updatedAt?: string;

    cliente: {
        id?: number;
        nome: string;
    };

    saf: {
        id?: string;
        identificacao: string;
        localizacao: {
            latitude: number | null;
            longitude: number | null;
        };
    };

    comunidade: {
        id?: string;
        nome: string;
    };

    proprietario: {
        id?: string;
        nome: string;
    };
}

export interface ICreateCertificadoDto {
    codigo: string;
    clienteId: number;
    safId: string;
    comunidadeId: string;
    proprietarioId: string;
    ano: number;
    tco2Compensadas: string;
    arvores: number;
    areaM2: string;
    ativo?: boolean;
}

export type IUpdateCertificadoDto = Partial<ICreateCertificadoDto>;

export interface IVerificarExistenciaCertificadoResponse {
    exists: boolean;
    codigo: string;
}