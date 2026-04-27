// src/components/AnoImagem.tsx
import React, { useEffect, useState } from "react";

export type AnoImagemProps = {
    value?: number | null;
    onChange: (year: number | null) => void;
    label?: string;
    minYear?: number;          // padrão: 1900
    maxYear?: number;          // padrão: ano atual
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
};

const getCurrentYear = () => new Date().getFullYear();

export default function AnoImagem({
    value = null,
    onChange,
    label = "Ano da Imagem",
    minYear = 1900,
    maxYear = getCurrentYear(),
    required = false,
    disabled = false,
    placeholder,
    autoFocus = false,
}: AnoImagemProps) {
    // Mantém string para permitir digitação parcial (ex.: "20")
    const [input, setInput] = useState<string>(value != null ? String(value) : "");

    // Sincroniza quando o value externo mudar
    useEffect(() => {
        setInput(value != null ? String(value) : "");
    }, [value]);

    // Converte string -> number|null sem travar digitação
    const toNumber = (s: string): number | null => {
        const digits = s.replace(/\D/g, "");
        if (!digits) return null;
        const n = Number(digits);
        return Number.isFinite(n) ? n : null;
    };

    // Digitação: mantém somente dígitos (até 4 chars) e propaga para o pai
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = e.target.value.replace(/\D/g, "").slice(0, 4);
        setInput(cleaned);
        onChange(toNumber(cleaned));
    };

    // Blur: se houver valor, aplica clamp para o range permitido
    const handleBlur = () => {
        const n = toNumber(input);
        if (n == null) return;
        const clamped = Math.min(Math.max(n, minYear), maxYear);
        if (clamped !== n) {
            setInput(String(clamped));
            onChange(clamped);
        }
    };

    const inputId = "ano-imagem-input";

    return (
        <div className="w-full max-w-sm">
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-600">*</span>}
            </label>

            <input
                id={inputId}
                type="text"
                inputMode="numeric"
                pattern="\d{4}"
                placeholder={placeholder ?? String(maxYear)}
                value={input}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
                autoFocus={autoFocus}
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                aria-describedby={`${inputId}-hint`}
            />

            <p id={`${inputId}-hint`} className="mt-1 text-xs text-gray-500">
                Digite um ano entre {minYear} e {maxYear}.
            </p>
        </div>
    );
}
