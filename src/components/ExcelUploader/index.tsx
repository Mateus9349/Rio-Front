import * as XLSX from "xlsx";
import { IPlantioCompleto } from "../../interfaces/plantioCompleto.interface";

interface Props {
  retornaDados: (dados: IPlantioCompleto[]) => void;
}

const ExcelUploader: React.FC<Props> = ({ retornaDados }) => {
  /* const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]); */

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Converte para JSON preservando os cabeçalhos corretos
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData.length === 0) return;

      // Ajuste: remover colunas vazias no início
      const correctedHeaders = jsonData[0].filter((header: any) => header);
      /* setHeaders(correctedHeaders); */

      // Ajuste: pegar apenas as colunas existentes
      const parsedData: IPlantioCompleto[] = jsonData.slice(1).map((row) =>
        correctedHeaders.reduce((acc: { [x: string]: any; }, header: string | number, index: string | number) => {
          acc[header] = row[index] || "";
          return acc;
        }, {} as Record<string, any>)
      );

      /* setData(parsedData); */
      retornaDados(parsedData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Carregar Planilha Excel</h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {/* {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )} */}
    </div>
  );
};

export default ExcelUploader;
