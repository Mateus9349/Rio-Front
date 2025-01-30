import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Feature, Geometry } from 'geojson';

interface MapaKMLProps {
    geoJson: any | null;
}

const MapaKML: React.FC<MapaKMLProps> = ({ geoJson }) => {
    useEffect(() => {
        if (!geoJson) return;

        const map = L.map('map').setView([-2.2953, -58.5229], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        try {
            L.geoJSON(geoJson, {
                style: (feature) => {
                    if (!feature) return {};
                    const type = feature.geometry.type;
                    return {
                        color: type === 'Polygon' ? '#0000ff' : '#ff0000',
                        weight: 2,
                        fillColor: type === 'Polygon' ? '#0000ff' : undefined,
                        fillOpacity: type === 'Polygon' ? 0.5 : undefined,
                    };
                },
                onEachFeature: (feature: Feature<Geometry, any> | undefined, layer) => {
                    if (!feature || !feature.properties) return;
                    const props = feature.properties;
                    const popupContent = `
                        <b>Proprietário:</b> ${props?.Propriet || 'N/A'}<br />
                        <b>Comunidade:</b> ${props?.Comunidade || 'N/A'}<br />
                        <b>Área:</b> ${props?.area_ha || 'N/A'} ha<br />
                        <b>N° do SAF:</b> ${props?.['n° do SAF'] || 'N/A'}
                    `;
                    layer.bindPopup(popupContent);
                },
                pointToLayer: (_feature, latlng) => {
                    return L.marker(latlng, {
                        icon: L.icon({
                            iconUrl: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png',
                            iconSize: [24, 24],
                        }),
                    });
                },
            }).addTo(map);
        } catch (error) {
            console.error('Erro ao renderizar o GeoJSON no mapa:', error);
        }

        return () => {
            map.remove();
        };
    }, [geoJson]);

    return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default MapaKML;
