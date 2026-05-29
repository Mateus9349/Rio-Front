import type { ICertificado } from "../interfaces/certificado.interface";
import type { IImagemSaf, ISAF } from "../interfaces/SAF.interface";

export type CertificadoSafLike = {
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
};

type CertificadoComDistribuicoes = ICertificado & {
    safs?: CertificadoSafLike[];
    certificadoSafs?: CertificadoSafLike[];
    saf?: CertificadoSafLike["saf"];
    comunidade?: CertificadoSafLike["comunidade"];
    proprietario?: CertificadoSafLike["proprietario"];
};

export function extrairSafsDoCertificado(certificado: ICertificado): CertificadoSafLike[] {
    const certificadoComDistribuicoes = certificado as CertificadoComDistribuicoes;

    if (Array.isArray(certificadoComDistribuicoes.safs)) {
        return certificadoComDistribuicoes.safs;
    }

    if (Array.isArray(certificadoComDistribuicoes.certificadoSafs)) {
        return certificadoComDistribuicoes.certificadoSafs;
    }

    // Fallback temporário para respostas híbridas/legadas da API enquanto todos os
    // endpoints passam a retornar as distribuições do certificado por SAF.
    if (certificadoComDistribuicoes.saf) {
        return [
            {
                saf: certificadoComDistribuicoes.saf,
                tco2Compensadas: certificado.tco2Compensadas,
                arvores: certificado.arvores,
                areaM2: certificado.areaM2,
                comunidade: certificadoComDistribuicoes.comunidade,
                proprietario: certificadoComDistribuicoes.proprietario,
            },
        ];
    }

    return [];
}

export function toImagemSafArray(v: unknown): IImagemSaf[] {
    if (!Array.isArray(v)) return [];

    return v.flatMap((item): IImagemSaf[] => {
        if (typeof item === "string") {
            return [{ url: item }];
        }

        if (typeof item === "object" && item !== null && "url" in item) {
            const imagem = item as IImagemSaf;
            return imagem.url ? [imagem] : [];
        }

        return [];
    });
}

export function getSafLatitude(saf: CertificadoSafLike["saf"]): number | null {
    const latitude = Number(saf?.latitude ?? saf?.localizacao?.latitude);
    return Number.isFinite(latitude) ? latitude : null;
}

export function getSafLongitude(saf: CertificadoSafLike["saf"]): number | null {
    const longitude = Number(saf?.longitude ?? saf?.localizacao?.longitude);
    return Number.isFinite(longitude) ? longitude : null;
}

export function certificadoSafParaSafMapa(certificadoSaf: CertificadoSafLike): ISAF | null {
    const saf = certificadoSaf.saf;
    if (!saf) return null;

    const latitude = getSafLatitude(saf);
    const longitude = getSafLongitude(saf);

    if (latitude === null || longitude === null || latitude === 0 || longitude === 0) {
        return null;
    }

    return {
        id: saf.id,
        identificacao: saf.identificacao,
        latitude,
        longitude,
        imagens: toImagemSafArray(saf.imagens),
    };
}

export function calcularTotaisCertificadoSafs(certificadoSafs: CertificadoSafLike[]): { arvores: number; carbono: number; area: number } {
    return certificadoSafs.reduce<{ arvores: number; carbono: number; area: number }>(
        (acc, certificadoSaf) => {
            const arvores = certificadoSaf.arvores || 0;
            const carbono = Number(certificadoSaf.tco2Compensadas) || 0;
            const areaM2 = Number(certificadoSaf.areaM2) || 0;
            const areaHa = areaM2 / 10000;

            return {
                arvores: acc.arvores + arvores,
                carbono: acc.carbono + carbono,
                area: acc.area + areaHa,
            };
        },
        { arvores: 0, carbono: 0, area: 0 }
    );
}

export function normalizarCodigoCertificado(codigo: string) {
    return codigo.trim().toUpperCase();
}
