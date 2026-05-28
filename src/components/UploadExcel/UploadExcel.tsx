import React, { useState } from "react";
import { Workbook } from "exceljs";

type PreviewRow = Record<"Coluna1" | "Coluna2" | "Coluna3", string | number>;

const UploadExcel: React.FC = () => {
  const [data, setData] = useState<PreviewRow[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const workbook = new Workbook();
      await workbook.xlsx.load(buffer);

      const sheet = workbook.worksheets[0];
      const rows = sheet.getSheetValues();

      const jsonData: PreviewRow[] = rows
        .filter((row): row is (string | number)[] => Array.isArray(row))
        .map((row) => ({
          Coluna1: row[1] || "",
          Coluna2: row[2] || "",
          Coluna3: row[3] || "",
        }));

      setData(jsonData);
    };
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload de Planilha (Seguro)</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="border p-2 rounded mb-4" />

      {data.length > 0 && (
        <table className="table-auto border-collapse border border-gray-400 w-full mt-4">
          <thead>
            <tr className="bg-gray-200">
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="border border-gray-400 p-2">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {Object.values(row).map((value, idx) => (
                  <td key={idx} className="border border-gray-400 p-2">{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UploadExcel;
