// interfaces/SAF.interface.ts
export interface IImagemSaf {
    url: string;
    ano: number;
}

export interface ISAF {
    id?: string;
    identificacao: string;
    latitude: number;
    longitude: number;
    imagens?: IImagemSaf[]; // <— agora objeto com url+ano
}

