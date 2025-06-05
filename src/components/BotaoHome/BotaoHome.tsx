import { useNavigate } from "react-router-dom";

interface Props {
    title: string;
    href: string;
}

export default function BotaoHome({ title, href }: Props) {
    const navigate = useNavigate();

    return (
        <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
            onClick={() => navigate(href)}
        >
            {title}
        </button>
    );
}
