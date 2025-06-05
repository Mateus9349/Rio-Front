import { ISAF } from "../../../interfaces/SAF.interface";

interface Props {
    saf: ISAF;
}

export default function CardSAF({ saf }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">{saf.identificacao}</h3>
            <p className="text-sm text-gray-600"><strong>ID:</strong> {saf.id}</p>
        </div>
    );
}
