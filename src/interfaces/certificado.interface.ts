import type { ICliente } from "./cliente.interface";

type ICertificadoCliente = Omit<ICliente, "id"> & { id?: number };

export interface ICertificadoSaf {
    id?: string;
    tco2Compensadas?: number | string | null;
    arvores?: number | null;
    areaM2?: number | string | null;
    saf?: {
        id?: string;
        identificacao: string;
        latitude?: number | string | null;
        longitude?: number | string | null;
        localizacao?: {
            latitude?: number | string | null;
            longitude?: number | string | null;
        } | null;
        imagens?: unknown;
    } | null;
    comunidade?: {
        id?: string;
        nome: string;
    } | null;
    proprietario?: {
        id?: string;
        nome: string;
        telefone?: string;
        email?: string;
    } | null;
}

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

    cliente: ICertificadoCliente;

    safs?: ICertificadoSaf[];
    certificadoSafs?: ICertificadoSaf[];

    // Campos mantidos apenas para compatibilidade temporária com respostas híbridas da API.
    saf: {
        id?: string;
        identificacao: string;
        latitude?: number | string | null;
        longitude?: number | string | null;
        localizacao: {
            latitude: number | null;
            longitude: number | null;
        };
        imagens?: unknown;
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
