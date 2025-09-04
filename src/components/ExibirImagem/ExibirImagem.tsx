interface Props {
    src: string;
    alt?: string;
    className?: string;
}

export default function ExibirImagem({ src, alt = "Imagem", className = "" }: Props) {
    const isDriveImage = /drive\.google\.com/.test(src);
    const driveIdMatch = src.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    const driveId = driveIdMatch ? driveIdMatch[1] : null;

    if (isDriveImage && driveId) {
        const previewLink = `https://drive.google.com/file/d/${driveId}/preview`;

        return (
            <iframe
                src={previewLink}
                className={`rounded border ${className}`}
                width="200"
                height="150"
                allow="autoplay"
                title={alt}
            />
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`rounded border w-[200px] h-[150px] ${className}`}
        />
    );
}
