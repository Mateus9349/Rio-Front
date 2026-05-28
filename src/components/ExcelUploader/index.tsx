import * as XLSX from "xlsx";
import { IPlantioCompleto } from "../../interfaces/plantioCompleto.interface";

type ExcelCell = string | number | boolean | Date | null | undefined;
type ExcelRow = ExcelCell[];

interface Props {
  retornaDados: (dados: IPlantioCompleto[]) => void;
}

const ExcelUploader: React.FC<Props> = ({ retornaDados }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { header: 1 });

      if (jsonData.length === 0) return;

      const correctedHeaders = jsonData[0]
        .filter((header): header is string | number => Boolean(header))
        .map(String);

      const parsedData = jsonData.slice(1).map((row) =>
        correctedHeaders.reduce<Record<string, ExcelCell>>((acc, header, index) => {
          acc[header] = row[index] || "";
          return acc;
        }, {})
      ) as unknown as IPlantioCompleto[];

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
    </div>
  );
};

export default ExcelUploader;
