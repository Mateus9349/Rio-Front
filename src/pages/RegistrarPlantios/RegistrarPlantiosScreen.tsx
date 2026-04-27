// RegistrarPlantioScreen.tsx
import { useEffect, useState } from "react";
import Banner from "../../components/Banner";
/* import styles from "./Home/Home.module.scss"; */
import ExcelUploader from "../../components/ExcelUploader";
import TabelaPlantios from "../../components/TabelaPlantio";
import { IPlantioCompleto } from "../../interfaces/plantioCompleto.interface";
import BotaoCadastro from "../../components/BotaoCadastro";
import FormPlantio from "../../components/Forms/FormPlantio/FormPlantio";
import { ICertificado } from "../../interfaces/certificado.interface";

const certificadoInicial: ICertificado = {
  codigo: '',
  ano: 0,
  tco2Compensadas: 0,
  arvores: 0,
  areaM2: 0,
  ativo: true,
  cliente: { nome: '' },
  saf: {
    identificacao: '',
    localizacao: {
      latitude: null,
      longitude: null,
    },
  },
  comunidade: { nome: '' },
  proprietario: { nome: '' },
};

export default function RegistrarPlantioScreen() {
  const [dadosDoPlantio, setDadosDoPlantio] = useState<ICertificado[]>([certificadoInicial]);
  const [indexAtual, setIndexAtual] = useState(0);
  const [menu, setMenu] = useState<'' | 'confirmacao' | 'tabela'>('');
  const [contadorAtualizacao, setContadorAtualizacao] = useState(0);
  const [verificacaoLiberada, setVerificacaoLiberada] = useState(false);
  
  const mapPlantioParaCertificado = (item: IPlantioCompleto): ICertificado => {
    return {
      codigo: item.ID_Cliente ?? '',
      ano: Number(item.Ano) || 0,
      tco2Compensadas: Number(item.tCO2compensadas) || 0,
      arvores: Number(item.Arvores) || 0,
      areaM2: Number(item.Area_m2) || 0,
      ativo: true,

      cliente: {
        nome: item.Cliente ?? '',
      },

      saf: {
        identificacao: item.SAFs ?? '',
        localizacao: {
          latitude: item.Coord_y ?? null,
          longitude: item.Coord_x ?? null,
        },
      },

      comunidade: {
        nome: item.Comunidade ?? '',
      },

      proprietario: {
        nome: item.Proprietario_Responsavel ?? '',
      },
    };
  };

  const handleUpload = (dados: IPlantioCompleto[]) => {
    if (dados.length === 0) return;

    const certificados = dados.map(mapPlantioParaCertificado);

    setDadosDoPlantio(certificados);
    setIndexAtual(0);
    setMenu('confirmacao');
  };

  const handleProximo = () => {
    if (indexAtual < dadosDoPlantio.length - 1) {
      setIndexAtual(indexAtual + 1);
    } else {
      alert("Todos os plantios foram confirmados!");
      setMenu('');
    }
  };

  const handleAnterior = () => {
    if (indexAtual > 0) {
      setIndexAtual(indexAtual - 1);
    } else {
      setMenu('');
    }
  };

  useEffect(() => {
    setVerificacaoLiberada(false); // reset quando mudar de item
  }, [indexAtual]);

  const renderMenuConfirmacao = () => (
    <>
      <FormPlantio
        key={indexAtual} // força rerender limpo do form
        certificado={dadosDoPlantio[indexAtual]}
        onVerificacaoFinalizada={(ok) => setVerificacaoLiberada(ok)}
      />

      <h1 className="text-2xl font-bold mb-6 text-center">
        Indice {indexAtual} de {dadosDoPlantio.length}
      </h1>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleAnterior}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
        <button
          onClick={handleProximo}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!verificacaoLiberada}
        >
          Próximo
        </button>
      </div>
    </>
  );

  const renderBotaoConfirmacao = () => (
    <BotaoCadastro
      text="Modo confirmação de dados"
      onClick={() => setMenu('confirmacao')}
    />
  );

  /* const renderTabela = () => (
    <TabelaPlantios
      dados={dadosDoPlantio}
      recarrega={contadorAtualizacao}
    />
  );

  const renderBotaoTabela = () => (
    <BotaoCadastro
      text="Ver tabela"
      onClick={() => {
        setContadorAtualizacao((prev) => prev + 1);
        setMenu('tabela');
      }}
    />
  ); */

  return (
    <main /* className={styles.homeContainer} */>
      <Banner />
      <ExcelUploader retornaDados={handleUpload} />

      {menu === 'confirmacao' && dadosDoPlantio.length > 0 && renderMenuConfirmacao()}
      {menu !== 'confirmacao' && dadosDoPlantio.length > 0 && renderBotaoConfirmacao()}

      {/* {menu === 'tabela' && renderTabela()}
      {menu !== 'tabela' && dadosDoPlantio.length > 0 && renderBotaoTabela()} */}
    </main>
  );
}
