import React, { useState } from "react";
import JSZip from "jszip";
import { parseString } from "xml2js";

interface KmlPlacemark {
  name?: string[];
  Point?: Array<{ coordinates?: string[] }>;
}

interface ParsedKml {
  kml?: {
    Document?: Array<{ Placemark?: KmlPlacemark[] }>;
  };
}

const KMZUploader: React.FC = () => {
  const [data, setData] = useState<{ nome: string; coordenadas: string }[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const zip = await JSZip.loadAsync(file);
      const kmlFile = Object.keys(zip.files).find((name) => name.endsWith(".kml"));

      if (!kmlFile) {
        alert("Arquivo KML não encontrado no KMZ!");
        return;
      }

      const kmlData = await zip.files[kmlFile].async("text");

      parseString(kmlData, (err: Error | null, result: ParsedKml) => {
        if (err) {
          console.error("Erro ao analisar KML:", err);
          return;
        }

        const placemarks = result?.kml?.Document?.[0]?.Placemark || [];
        const extractedData = placemarks.map((placemark) => {
          const nome = placemark.name?.[0] || "Sem nome";
          const coordenadas = placemark?.Point?.[0]?.coordinates?.[0]?.trim() || "Sem coordenadas";
          return { nome, coordenadas };
        });

        setData(extractedData);
      });
    } catch (error) {
      console.error("Erro ao processar o arquivo KMZ:", error);
    }
  };

  return (
    <div>
      <h2>Carregar Arquivo KMZ</h2>
      <input type="file" accept=".kmz" onChange={handleFileUpload} />
      <ul>
        {data.length > 0 ? (
          data.map((item, index) => (
            <li key={index}>
              <strong>{item.nome}</strong>: {item.coordenadas}
            </li>
          ))
        ) : (
          <p>Nenhum dado carregado.</p>
        )}
      </ul>
    </div>
  );
};

export default KMZUploader;
