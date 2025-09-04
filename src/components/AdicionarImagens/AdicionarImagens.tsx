import { useEffect, useState } from "react";

interface Props {
    onSubmit: (href: string) => void;
}

export default function AdicionarImagens({ onSubmit }: Props) {
    const [add, setAdd] = useState(false);
    const [link, setLink] = useState("");
    const [imagemValida, setImagemValida] = useState(false);
    const [previewTipo, setPreviewTipo] = useState<"drive" | "direto" | null>(null);
    const [urlPreview, setUrlPreview] = useState("");

    useEffect(() => {
        setImagemValida(false);
        setPreviewTipo(null);
        setUrlPreview("");

        if (!link) return;

        const matchDrive = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//);

        if (matchDrive && matchDrive[1]) {
            const id = matchDrive[1];
            const iframeUrl = `https://drive.google.com/file/d/${id}/preview`;
            //const downloadUrl = `https://drive.google.com/file/d/${id}/view?usp=sharing`;

            setPreviewTipo("drive");
            setUrlPreview(iframeUrl);
            setImagemValida(true); // assume válido se for drive
        } else {
            // É link direto de imagem — tenta validar carregando a imagem
            setPreviewTipo("direto");
            setUrlPreview(link);
        }
    }, [link]);

    const handleSalvar = () => {
        onSubmit(link);
    };

    return (
        <div className="mt-4 p-4 border rounded shadow-md text-left">
            {!add && (
                <button
                    onClick={() => setAdd(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Adicionar imagem
                </button>
            )}

            {add && (
                <div className="flex flex-col gap-4 mt-4">
                    <input
                        type="text"
                        placeholder="Insira o link da imagem (Drive ou direto)"
                        className="border p-2 rounded"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />

                    {/* Preview da imagem */}
                    {previewTipo === "drive" && (
                        <iframe
                            src={urlPreview}
                            width="320"
                            height="240"
                            allow="autoplay"
                            className="rounded border"
                        ></iframe>
                    )}

                    {previewTipo === "direto" && (
                        <img
                            src={urlPreview}
                            alt="Pré-visualização"
                            className="max-w-xs max-h-64 border rounded"
                            onLoad={() => setImagemValida(true)}
                            onError={() => setImagemValida(false)}
                        />
                    )}

                    <button
                        disabled={!imagemValida}
                        onClick={handleSalvar}
                        className={`px-4 py-2 rounded text-white ${imagemValida
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Salvar
                    </button>
                </div>
            )}
        </div>
    );
}
