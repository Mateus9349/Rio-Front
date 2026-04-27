import { useCallback, useRef, useState } from "react";
import SafService from "../../services/SafService";
import type { ISAF } from "../../interfaces/SAF.interface";

/**
 * Hook de mutações para SAF:
 * - atualizarSaf(id, patch)
 * - adicionarImagem(id, url, ano)
 * - removerImagem(id, url)
 *
 * Retorna também estados: loading, erro, e método clearError.
 */
export default function useAtualizaSaf() {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<Error | null>(null);
    const mountedRef = useRef(true);

    // marca/desmarca componente montado (protege setState após unmount)
    // use em páginas onde o hook vive por muito tempo; opcionalmente remova se não precisar
    // (Como é um hook isolado, não temos useEffect aqui; assuma que o componente pai desmonte rapidamente)
    const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
        setLoading(true);
        setErro(null);
        try {
            const result = await fn();
            return result;
        } catch (e) {
            const err = e as Error;
            if (mountedRef.current) setErro(err);
            throw err;
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, []);

    const atualizarSaf = useCallback(
        async (id: string, patch: Partial<ISAF>): Promise<ISAF> => {
            if (!id) throw new Error("ID do SAF é obrigatório.");
            return run(async () => {
                const updated = await SafService.atualizarSaf(id, patch);
                return updated;
            });
        },
        [run]
    );

    const adicionarImagem = useCallback(
        async (id: string, url: string, ano: number): Promise<ISAF> => {
            if (!id) throw new Error("ID do SAF é obrigatório.");
            if (!url) throw new Error("URL da imagem é obrigatória.");
            if (!Number.isInteger(ano)) throw new Error("Ano da imagem inválido.");
            return run(async () => {
                const updated = await SafService.adicionarImagem(id, { url, ano });
                return updated;
            });
        },
        [run]
    );

    const removerImagem = useCallback(
        async (id: string, url: string): Promise<ISAF> => {
            if (!id) throw new Error("ID do SAF é obrigatório.");
            if (!url) throw new Error("URL da imagem é obrigatória.");
            return run(async () => {
                const updated = await SafService.removerImagem(id, url);
                return updated;
            });
        },
        [run]
    );

    const clearError = useCallback(() => setErro(null), []);

    return { atualizarSaf, adicionarImagem, removerImagem, loading, erro, clearError };
}
