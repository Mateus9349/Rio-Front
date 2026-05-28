// File: components/TabelaPlantios.tsx
import { useCallback, useEffect, useState } from "react";
import useSafs from "../../hooks/Safs/useSafs";
import useComunidades from "../../hooks/comunidade/useComunidades";
import useProprietarios from "../../hooks/proprietario/useProprietarios";
import { normalizar } from "../../utils/funcoes";
import TabelaHeader from "../TabelaHeader/TabelaHeader";
import LinhaPlantio from "../LinhaPlantio/LinhaPlantio";
import FormPlantio from "../Forms/FormPlantio/FormPlantio";
import { ICertificado } from "../../interfaces/certificado.interface";
import { useVerificaExisteCertificado } from "../../hooks/certificados/useVerificaExistenciaCertificado";

interface Props {
  dados: ICertificado[];
  recarrega?: number;
}

type StatusCadastro = boolean | "aguardando";

export default function TabelaPlantios({ dados, recarrega }: Props) {
  const { safs } = useSafs();
  const { comunidades } = useComunidades();
  const { proprietarios } = useProprietarios();

  const { verificarExisteCertificado, loadingVerificaExistencia } =
    useVerificaExisteCertificado();

  const [statusCadastro, setStatusCadastro] = useState<StatusCadastro[]>([]);
  const [plantioSelecionado, setPlantioSelecionado] =
    useState<ICertificado | null>(null);

  const normalizarCertificado = useCallback((certificado: ICertificado): ICertificado => {
    return {
      ...certificado,
      cliente: {
        ...certificado.cliente,
        nome: normalizar(certificado.cliente.nome),
      },
      comunidade: {
        ...certificado.comunidade,
        nome: normalizar(certificado.comunidade.nome),
      },
      proprietario: {
        ...certificado.proprietario,
        nome: normalizar(certificado.proprietario.nome),
      },
      saf: {
        ...certificado.saf,
        identificacao: normalizar(certificado.saf.identificacao),
      },
    };
  }, []);

  const verificarStatusCertificados = useCallback(async () => {
    if (!dados.length) {
      setStatusCadastro([]);
      return;
    }

    if (!safs.length || !comunidades.length || !proprietarios.length) {
      setStatusCadastro(dados.map(() => "aguardando"));
      return;
    }

    setStatusCadastro(dados.map(() => "aguardando"));

    const resultados = await Promise.all(
      dados.map(async (certificadoOriginal) => {
        const certificado = normalizarCertificado(certificadoOriginal);

        const safExiste = safs.find(
          (saf) =>
            normalizar(saf.identificacao) ===
            normalizar(certificado.saf.identificacao)
        );

        const comunidadeExiste = comunidades.find(
          (comunidade) =>
            normalizar(comunidade.nome) ===
            normalizar(certificado.comunidade.nome)
        );

        const proprietarioExiste = proprietarios.find(
          (proprietario) =>
            normalizar(proprietario.nome) ===
            normalizar(certificado.proprietario.nome)
        );

        const dadosBaseExistem =
          Boolean(safExiste?.id) &&
          Boolean(comunidadeExiste?.id) &&
          Boolean(proprietarioExiste?.id);

        if (!dadosBaseExistem) {
          return false;
        }

        try {
          const existe = await verificarExisteCertificado(
            certificado.codigo,
            certificado.saf.identificacao
          );

          return Boolean(existe);
        } catch (error) {
          console.error(
            "Erro ao verificar certificado na tabela:",
            certificado.codigo,
            certificado.saf.identificacao,
            error
          );

          return "aguardando" as const;
        }
      })
    );

    setStatusCadastro(resultados);
  }, [
    dados,
    safs,
    comunidades,
    proprietarios,
    normalizarCertificado,
    verificarExisteCertificado,
  ]);

  useEffect(() => {
    verificarStatusCertificados();
  }, [verificarStatusCertificados, recarrega]);

  const handleCadastroFinalizado = async () => {
    setPlantioSelecionado(null);
    await verificarStatusCertificados();
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <TabelaHeader />

        <tbody>
          {dados.map((plantio, index) => (
            <LinhaPlantio
              key={`${plantio.codigo}-${plantio.saf.identificacao}-${index}`}
              plantio={plantio}
              status={statusCadastro[index] ?? "aguardando"}
              onCadastrar={() =>
                setPlantioSelecionado(normalizarCertificado(plantio))
              }
            />
          ))}
        </tbody>
      </table>

      {loadingVerificaExistencia && (
        <p className="text-center text-sm mt-2 text-gray-500">
          Verificando status dos certificados...
        </p>
      )}

      {plantioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-4xl">
            <FormPlantio
              certificado={plantioSelecionado}
              onVerificacaoFinalizada={handleCadastroFinalizado}
            />
          </div>
        </div>
      )}
    </div>
  );
}