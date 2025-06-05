interface PlantioButtonsProps {
  onVoltar?: () => void;
  onProximo?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function PlantioButtons({
  onVoltar,
  onProximo,
  loading = false,
  disabled = false,
}: PlantioButtonsProps) {
  const isDisabled = loading || disabled;

  return (
    <>
      {/* Botão Confirmar - Centralizado */}
      <div className="col-span-2 flex justify-center mt-4">
        <button
          type="submit"
          disabled={isDisabled}
          className={`px-6 py-2 rounded ${isDisabled ? "bg-gray-500" : "bg-green-600"} text-white cursor-pointer`}
        >
          {loading ? "Cadastrando..." : "Confirmar"}
        </button>
      </div>

      {/* Botões Voltar e Próximo - lado a lado */}
      <div className="col-span-2 flex justify-between mt-4">
        <button
          type="button"
          onClick={onVoltar}
          className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
          disabled={isDisabled}
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={onProximo}
          className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
          disabled={isDisabled}
        >
          Próximo
        </button>
      </div>
    </>
  );
}
