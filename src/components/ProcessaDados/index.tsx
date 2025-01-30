import React, { useState } from "react";
import { DOMParser } from "@xmldom/xmldom"; // Para manipulação de XML
import * as toGeoJSON from "@mapbox/togeojson"; // Certifique-se de que o pacote está instalado
import MapaKML from "../MapaKML";
import { IDadosCompensados } from "../../interfaces/dadosCompensados.interface";

export default function ProcessarKML({ passaDados }: { passaDados: (dados: IDadosCompensados) => void }) {
    const [geoJson, setGeoJson] = useState<any | null>(null);
    const [dadosCompensados, setDadosCompensados] = useState<IDadosCompensados[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const kmlText = e.target?.result as string;

                    if (!kmlText) {
                        throw new Error("O arquivo KML está vazio.");
                    }

                    // Parseando o texto KML
                    const parser = new DOMParser();
                    const kmlDoc = parser.parseFromString(kmlText, "application/xml");

                    // Verifica erros no parsing
                    const parseError = kmlDoc.getElementsByTagName("parsererror");
                    if (parseError.length > 0) {
                        throw new Error("Erro ao parsear o arquivo KML.");
                    }

                    // Converte o KML para GeoJSON
                    const geoJsonData = toGeoJSON.kml(kmlDoc);

                    if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
                        throw new Error("Nenhuma geometria válida encontrada no arquivo KML.");
                    }

                    // Extraindo dados do GeoJSON
                    const dadosExtraidos = geoJsonData.features.map((feature: any) => {
                        const props = feature.properties || {};
                        const geometry = feature.geometry;

                        return {
                            areaHa: parseFloat(props["area_ha"] || "0"),
                            layer: props["layer"] || "",
                            proprietario: props["Propriet"] || "",
                            comunidade: props["Comunidade"] || "",
                            xCentroid: parseFloat(props["x_centroid"] || "0"),
                            y: parseFloat(props["y"] || "0"),
                            numeroSAF: parseInt(props["n° do SAF"] || "0"),
                            coordenadas: geometry.type === "Point" ? geometry.coordinates : [0, 0, 0],
                        };
                    });

                    console.log("GeoJSON gerado:", geoJsonData);
                    console.log("Dados extraídos:", dadosExtraidos);

                    // Atualizando os estados
                    setGeoJson(geoJsonData);
                    setDadosCompensados(dadosExtraidos);
                    passaDados(dadosExtraidos[0]);
                } catch (error) {
                    console.error("Erro ao processar o KML:", error);
                    alert("Erro ao processar o arquivo KML. Verifique o formato.");
                }
            };

            reader.readAsText(file);
        }
    };

    return (
        <div>
            <h1>Upload e Visualização de Arquivo KML</h1>
            <input type="file" accept=".kml" onChange={handleFileUpload} />
            <div>
                <h2>Dados Extraídos</h2>
                <pre>{JSON.stringify(dadosCompensados, null, 2)}</pre>
            </div>
            {geoJson && <MapaKML geoJson={geoJson} />}
        </div>
    );
}
