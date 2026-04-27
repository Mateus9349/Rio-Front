import React, { useEffect, useMemo, useState } from "react";
import { ISAF } from "../../../interfaces/SAF.interface";


type Props = {
    saf: ISAF;
    loading?: boolean;
    onSubmit: (dadosParciais: Partial<ISAF>) => void;
};

type FormState = {
    identificacao: string;
    latitude: string;   // string para lidar bem com vírgula/ponto no input
    longitude: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

function parseNumberBR(v: string): number | null {
    if (v == null) return null;
    const s = v.replace(/\s/g, "").replace(",", ".");
    if (s === "") return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

function buildPatch(original: ISAF, form: FormState): Partial<ISAF> {
    const patch: Partial<ISAF> = {};

    const ident = form.identificacao.trim();
    if (ident !== original.identificacao) patch.identificacao = ident;

    const lat = parseNumberBR(form.latitude);
    if (lat !== null && lat !== original.latitude) patch.latitude = lat;

    const lon = parseNumberBR(form.longitude);
    if (lon !== null && lon !== original.longitude) patch.longitude = lon;

    // NÃO alteramos anoImagem aqui
    return patch;
}

function validate(form: FormState): Errors {
    const errs: Errors = {};

    if (!form.identificacao.trim()) {
        errs.identificacao = "Informe a identificação.";
    }

    const lat = parseNumberBR(form.latitude);
    if (lat === null) errs.latitude = "Informe a latitude.";
    else if (lat < -90 || lat > 90) errs.latitude = "Latitude deve estar entre -90 e 90.";

    const lon = parseNumberBR(form.longitude);
    if (lon === null) errs.longitude = "Informe a longitude.";
    else if (lon < -180 || lon > 180) errs.longitude = "Longitude deve estar entre -180 e 180.";

    return errs;
}

export default function FormAtualizaSaf({ saf, onSubmit, loading }: Props) {
    const [form, setForm] = useState<FormState>({
        identificacao: saf.identificacao ?? "",
        latitude: String(saf.latitude ?? ""),
        longitude: String(saf.longitude ?? ""),
    });

    const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
        identificacao: false,
        latitude: false,
        longitude: false,
    });

    useEffect(() => {
        setForm({
            identificacao: saf.identificacao ?? "",
            latitude: String(saf.latitude ?? ""),
            longitude: String(saf.longitude ?? ""),
        });
        setTouched({
            identificacao: false,
            latitude: false,
            longitude: false,
        });
    }, [saf]);

    const errors = useMemo(() => validate(form), [form]);
    const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
    const patch = useMemo(() => buildPatch(saf, form), [saf, form]);
    const isDirty = useMemo(() => Object.keys(patch).length > 0, [patch]);

    function handleChange<K extends keyof FormState>(key: K, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleBlur<K extends keyof FormState>(key: K) {
        setTouched((prev) => ({ ...prev, [key]: true }));
    }

    function handleReset() {
        setForm({
            identificacao: saf.identificacao ?? "",
            latitude: String(saf.latitude ?? ""),
            longitude: String(saf.longitude ?? ""),
        });
        setTouched({
            identificacao: false,
            latitude: false,
            longitude: false,
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched({ identificacao: true, latitude: true, longitude: true });
        if (!isValid) return;
        if (!isDirty) {
            alert("Nenhuma alteração para salvar.");
            return;
        }
        onSubmit(patch);
    }

    const helperMuted = "text-xs text-gray-500";

    return (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
            {/* Identificação */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identificação
                </label>
                <input
                    type="text"
                    value={form.identificacao}
                    onChange={(e) => handleChange("identificacao", e.target.value)}
                    onBlur={() => handleBlur("identificacao")}
                    disabled={loading}
                    className={`w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${touched.identificacao && errors.identificacao ? "border-red-500" : "border-gray-300"
                        }`}
                    placeholder="Ex.: SAF-001"
                />
                {touched.identificacao && errors.identificacao ? (
                    <p className="mt-1 text-sm text-red-600">{errors.identificacao}</p>
                ) : (
                    <p className={`mt-1 ${helperMuted}`}>Nome/ID amigável do SAF.</p>
                )}
            </div>

            {/* Latitude */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                </label>
                <input
                    inputMode="decimal"
                    step="0.000001"
                    min={-90}
                    max={90}
                    value={form.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    onBlur={() => handleBlur("latitude")}
                    disabled={loading}
                    className={`w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${touched.latitude && errors.latitude ? "border-red-500" : "border-gray-300"
                        }`}
                    placeholder="-3,123456"
                />
                {touched.latitude && errors.latitude ? (
                    <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                ) : (
                    <p className={`mt-1 ${helperMuted}`}>Ex.: -3,123456 (aceita vírgula ou ponto).</p>
                )}
            </div>

            {/* Longitude */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                </label>
                <input
                    inputMode="decimal"
                    step="0.000001"
                    min={-180}
                    max={180}
                    value={form.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    onBlur={() => handleBlur("longitude")}
                    disabled={loading}
                    className={`w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${touched.longitude && errors.longitude ? "border-red-500" : "border-gray-300"
                        }`}
                    placeholder="-60,123456"
                />
                {touched.longitude && errors.longitude ? (
                    <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                ) : (
                    <p className={`mt-1 ${helperMuted}`}>Ex.: -60,123456 (aceita vírgula ou ponto).</p>
                )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading || !isValid || !isDirty}
                    className={`px-4 py-2 rounded text-white transition ${loading || !isValid || !isDirty
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    title={!isDirty ? "Altere algum campo para habilitar" : ""}
                >
                    {loading ? "Salvando..." : "Salvar alterações"}
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
                >
                    Desfazer alterações
                </button>

                {isDirty && isValid && (
                    <span className="text-xs text-gray-500">Somente campos alterados serão enviados.</span>
                )}
            </div>

            {/* (Opcional) Mostrar anoImagem somente leitura */}
            {/* <p className="text-sm text-gray-600">
        Ano da imagem (somente leitura): <span className="font-medium">{saf.anoImagem}</span>
      </p> */}
        </form>
    );
}
