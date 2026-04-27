import { useCallback, useEffect, useMemo, useState } from "react";
import CardSAF from "../components/Cards/CardSaf/CardSaf";
import useSafs from "../hooks/Safs/useSafs";
import useAtualizaSaf from "../hooks/Safs/useAtualizaSaf";
import { ISAF } from "../interfaces/SAF.interface";
import AdicionarImagens from "../components/AdicionarImagens/AdicionarImagens";
import Galeria from "../components/Galeria/Galeria";
import FormAtualizaSaf from "../components/Forms/FormAtualizaSaf/FormAtualizaSaf";
import AnoImagem from "../components/AnoImagem/AnoImagem";

type Modo = "lista" | "edicao";
type Aba = "imagens" | "informacoes";

export default function SAFs() {
  const { safs, loadingSaf, erroSaf, refetchSafs, upsertLocal } = useSafs();
  const { atualizarSaf, adicionarImagem, removerImagem, loading: mutating } = useAtualizaSaf();

  const [modo, setModo] = useState<Modo>("lista");
  const [aba, setAba] = useState<Aba>("imagens");
  const [selectedSaf, setSelectedSaf] = useState<ISAF | null>(null);
  const [saving, setSaving] = useState(false);
  const [anoImagem, setAnoImagem] = useState<number | null>(null);

  // Seleciona um SAF para edição e zera ano local (ou defina um default se preferir)
  const selecionarParaEdicao = useCallback((saf: ISAF) => {
    setSelectedSaf(saf);
    setAnoImagem(null);
    setAba("imagens");
    setModo("edicao");
  }, []);

  const handleVoltar = useCallback(() => {
    setModo("lista");
    setSelectedSaf(null);
    setAnoImagem(null);
  }, []);

  // --- IMAGENS (url + ano) ---
  const handleAddImagemComAno = useCallback(
    async (link: string) => {
      if (!selectedSaf?.id) return;
      if (anoImagem == null || !Number.isInteger(anoImagem)) {
        alert("Informe um ano válido (YYYY) antes de adicionar.");
        return;
      }
      try {
        setSaving(true);
        const atualizado = await adicionarImagem(selectedSaf.id, link, anoImagem);
        setSelectedSaf(atualizado);
        upsertLocal(atualizado);
        await refetchSafs();
      } catch (erro) {
        console.error("Erro ao adicionar imagem:", erro);
        alert("Erro ao adicionar imagem.");
      } finally {
        setSaving(false);
      }
    },
    [selectedSaf, anoImagem, adicionarImagem, upsertLocal, refetchSafs]
  );

  const handleExcluirImagem = useCallback(
    async (imagemUrl: string) => {
      if (!selectedSaf?.id) return;
      try {
        setSaving(true);
        const atualizado = await removerImagem(selectedSaf.id, imagemUrl);
        setSelectedSaf(atualizado);
        upsertLocal(atualizado);
        await refetchSafs();
      } catch (erro) {
        console.error("Erro ao excluir imagem:", erro);
        alert("Erro ao excluir imagem.");
      } finally {
        setSaving(false);
      }
    },
    [selectedSaf, removerImagem, upsertLocal, refetchSafs]
  );

  // --- INFORMAÇÕES (não mexe com ano por imagem) ---
  const handleSalvarInformacoes = useCallback(
    async (dadosParciais: Partial<ISAF>) => {
      if (!selectedSaf?.id) return;
      try {
        setSaving(true);
        const atualizado = await atualizarSaf(selectedSaf.id, dadosParciais);
        setSelectedSaf(atualizado);
        upsertLocal(atualizado);
        await refetchSafs();
        alert("Informações atualizadas!");
      } catch (erro) {
        console.error("Erro ao atualizar informações:", erro);
        alert("Erro ao atualizar informações do SAF.");
      } finally {
        setSaving(false);
      }
    },
    [selectedSaf, atualizarSaf, upsertLocal, refetchSafs]
  );

  // Se o selectedSaf trocar, você pode optar por manter/limpar o ano
  useEffect(() => {
    // manter como null para forçar escolha clara por imagem
    setAnoImagem(null);
  }, [selectedSaf?.id]);

  // Se seu <Galeria> ainda espera string[], mapeie objetos -> urls
  const imagensUrls: string[] = useMemo(() => {
    const imgs = selectedSaf?.imagens ?? [];
    return imgs.map ? imgs.map((i: any) => (typeof i === "string" ? i : i.url)) : [];
  }, [selectedSaf?.imagens]);

  const lista = useMemo(() => {
    if (!safs?.length) return <p className="text-gray-600">Nenhum SAF cadastrado.</p>;
    return (
      <div className="flex flex-wrap gap-6">
        {safs.map((saf) => (
          <div key={saf.id} className="rounded-lg border p-3">
            <CardSAF saf={saf} />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => selecionarParaEdicao(saf)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                editar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }, [safs, selecionarParaEdicao]);

  const busy = saving || mutating;

  return (
    <div className="px-6 py-8">
      {loadingSaf && <p className="text-gray-600">Carregando SAFs...</p>}
      {erroSaf && <p className="text-red-500">Erro: {erroSaf.message}</p>}

      {modo === "lista" && !loadingSaf && !erroSaf && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">SAFs Cadastrados</h1>
          {lista}
        </>
      )}

      {modo === "edicao" && selectedSaf && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleVoltar}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              disabled={busy}
            >
              voltar
            </button>
            {busy && <span className="text-sm text-gray-500">salvando…</span>}
          </div>

          <CardSAF saf={selectedSaf} />

          {/* Abas */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex gap-4">
              <button
                className={`px-3 py-2 -mb-px border-b-2 ${aba === "imagens"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                onClick={() => setAba("imagens")}
              >
                Imagens
              </button>
              <button
                className={`px-3 py-2 -mb-px border-b-2 ${aba === "informacoes"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                onClick={() => setAba("informacoes")}
              >
                Informações
              </button>
            </nav>
          </div>

          {/* Conteúdo das abas */}
          {aba === "imagens" && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Gerenciar Imagens</h2>

              {/* Galeria */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Galeria</h3>
                {/* Se seu <Galeria> já suporta objetos, troque "imagens={imagensUrls}" por "imagens={selectedSaf.imagens ?? []}" */}
                <Galeria imagens={imagensUrls} excluirImagem={handleExcluirImagem} />
              </div>

              {/* Ano + Adicionar imagem (url + ano) */}
              <div className="mb-6">
                <AnoImagem
                  value={anoImagem}
                  onChange={setAnoImagem}
                  minYear={1990}
                  maxYear={new Date().getFullYear()}
                  autoFocus
                />
                <p className="mt-1 text-xs text-gray-500">
                  O ano informado será aplicado à próxima imagem adicionada.
                </p>
              </div>

              <div className="mt-4">
                <h4 className="text-base font-medium mb-2">Adicionar Imagem</h4>
                <AdicionarImagens onSubmit={handleAddImagemComAno} />
                <p className="mt-1 text-xs text-gray-500">
                  Para adicionar, informe o ano acima e cole o link da imagem.
                </p>
              </div>
            </div>
          )}

          {aba === "informacoes" && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Editar Informações</h2>
              <FormAtualizaSaf saf={selectedSaf} onSubmit={handleSalvarInformacoes} loading={busy} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
