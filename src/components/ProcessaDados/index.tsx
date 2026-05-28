import React, { useState } from "react";
import { DOMParser } from "@xmldom/xmldom";
import * as toGeoJSON from "@mapbox/togeojson";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import MapaKML from "../MapaKML";
import { IDadosCompensados } from "../../interfaces/dadosCompensados.interface";

function getProperty(props: GeoJsonProperties, key: string): string {
    const value = props?.[key];
    return value === undefined || value === null ? "" : String(value);
}

function coordenadasDaFeature(feature: Feature<Geometry, GeoJsonProperties>): [number, number, number] {
    if (feature.geometry.type !== "Point") {
        return [0, 0, 0];
    }

    const [longitude = 0, latitude = 0, altitude = 0] = feature.geometry.coordinates;
    return [Number(longitude), Number(latitude), Number(altitude)];
}

export default function ProcessarKML({ passaDados }: { passaDados: (dados: IDadosCompensados) => void }) {
    const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
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

                    const parser = new DOMParser();
                    const kmlDoc = parser.parseFromString(kmlText, "application/xml");

                    const parseError = kmlDoc.getElementsByTagName("parsererror");
                    if (parseError.length > 0) {
                        throw new Error("Erro ao parsear o arquivo KML.");
                    }

                    const geoJsonData = toGeoJSON.kml(kmlDoc) as FeatureCollection;

                    if (!geoJsonData?.features?.length) {
                        throw new Error("Nenhuma geometria válida encontrada no arquivo KML.");
                    }

                    const dadosExtraidos = geoJsonData.features.map((feature) => {
                        const props = feature.properties || {};

                        return {
                            areaHa: parseFloat(getProperty(props, "area_ha") || "0"),
                            layer: getProperty(props, "layer"),
                            proprietario: getProperty(props, "Propriet"),
                            comunidade: getProperty(props, "Comunidade"),
                            xCentroid: parseFloat(getProperty(props, "x_centroid") || "0"),
                            y: parseFloat(getProperty(props, "y") || "0"),
                            numeroSAF: parseInt(getProperty(props, "n° do SAF") || "0", 10),
                            coordenadas: coordenadasDaFeature(feature),
                        };
                    });

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
