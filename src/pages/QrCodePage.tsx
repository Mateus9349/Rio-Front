import React, { useRef, useState, ChangeEvent } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QrCodePage() {
    const [url, setUrl] = useState<string>("");
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    function handleUrlChange(event: ChangeEvent<HTMLInputElement>) {
        setUrl(event.target.value);
    }

    function isValidUrl(value: string): boolean {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }

    const trimmedUrl = url.trim();
    const canGenerate = trimmedUrl.length > 0 && isValidUrl(trimmedUrl);

    function downloadPng() {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const pngUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "qrcode.png";
        link.click();
    }

    return (
        <main style={styles.page}>
            <section style={styles.card}>
                <h1 style={styles.title}>Gerador de QR Code</h1>

                <label style={styles.label}>URL</label>

                <input
                    type="url"
                    placeholder="https://exemplo.com"
                    value={url}
                    onChange={handleUrlChange}
                    style={styles.input}
                />

                {!canGenerate && trimmedUrl && (
                    <p style={styles.error}>Digite uma URL válida</p>
                )}

                <div style={styles.qrArea}>
                    {canGenerate ? (
                        <QRCodeCanvas
                            value={trimmedUrl}
                            size={220}
                            level="H"
                            includeMargin
                            ref={canvasRef}
                        />
                    ) : (
                        <p style={styles.placeholder}>O QR Code aparecerá aqui</p>
                    )}
                </div>

                <button
                    onClick={downloadPng}
                    disabled={!canGenerate}
                    style={{
                        ...styles.button,
                        opacity: canGenerate ? 1 : 0.5,
                        cursor: canGenerate ? "pointer" : "not-allowed",
                    }}
                >
                    Baixar PNG
                </button>
            </section>
        </main>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        padding: "24px",
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        background: "#fff",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    },
    title: {
        marginBottom: "24px",
        fontSize: "28px",
        textAlign: "center",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    error: {
        color: "red",
        fontSize: "14px",
        marginTop: "8px",
    },
    qrArea: {
        marginTop: "24px",
        minHeight: "240px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed #ccc",
        borderRadius: "12px",
    },
    placeholder: {
        color: "#777",
    },
    button: {
        marginTop: "20px",
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#111",
        color: "#fff",
        fontWeight: "bold",
    },
};