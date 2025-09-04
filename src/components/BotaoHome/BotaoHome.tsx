import { useNavigate } from "react-router-dom";

interface Props {
    title: string;
    href: string;
}

export default function BotaoHome({ title, href }: Props) {
    const navigate = useNavigate();

    return (
        <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl shadow-2xl mx-2 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(href)}
        >
            {title}
        </button>
    );
}
