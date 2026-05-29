// components/FormAtualizaCliente.tsx
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICliente } from "../../interfaces/cliente.interface";
import BotaoCadastro from "../BotaoCadastro";
import useAtualizarCliente from "../../hooks/clientes/useAtualizarCliente";

// Schema apenas para "nome"
const schema = z.object({
    nome: z.string().trim().min(2, "Nome precisa ter pelo menos 2 caracteres."),
});

type FormValues = z.infer<typeof schema>;

type FormAtualizaClienteProps = {
    cliente: ICliente;
    onCancel?: () => void;
    /** Chame algo como refetch no pai se quiser. */
    onSuccess?: (updated: Partial<ICliente>) => void;
};

export default function FormAtualizaCliente({
    cliente,
    onCancel,
    onSuccess,
}: FormAtualizaClienteProps) {
    const { atualizarCliente } = useAtualizarCliente();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: cliente.nome ?? "",
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setServerError(null);

        const payload: Partial<ICliente> = {
            nome: values.nome,
        };

        try {
            await atualizarCliente(cliente.id, payload);
            onSuccess?.(payload);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Falha ao atualizar o cliente.";
            setServerError(message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-xl w-full p-4 border rounded-lg bg-white shadow-sm"
            noValidate
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Editar Cliente
            </h2>

            {/* Nome */}
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome
            </label>
            <input
                id="nome"
                type="text"
                {...register("nome")}
                className="mt-1 mb-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ex.: Maria Silva"
                autoComplete="name"
                aria-invalid={!!errors.nome}
                autoFocus
            />
            {errors.nome && (
                <p className="text-red-600 text-sm mb-2">{errors.nome.message}</p>
            )}

            {/* Erro do servidor */}
            {serverError && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            {/* Ações */}
            <div className="mt-4 flex items-center gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
                >
                    {isSubmitting ? "Salvando..." : "Salvar"}
                </button>

                {onCancel ? (
                    <BotaoCadastro text="Voltar" onClick={onCancel} />
                ) : (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Voltar
                    </button>
                )}
            </div>
        </form>
    );
}
