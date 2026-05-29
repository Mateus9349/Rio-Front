import type { IImagemSaf } from './SAF.interface';

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
        imagem?: string;
    };

    saf: {
        id?: string;
        identificacao: string;
        localizacao: {
            latitude: number | null;
            longitude: number | null;
        };
        latitude?: number | string | null;
        longitude?: number | string | null;
        imagens?: IImagemSaf[] | string[];
    };

    comunidade: {
        id?: string;
        nome: string;
    };

    proprietario: {
        id?: string;
        nome: string;
        telefone?: string;
        email?: string;
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