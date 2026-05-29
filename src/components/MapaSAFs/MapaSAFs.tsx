import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import { ISAF } from '../../interfaces/SAF.interface';
import { DefaultIcon } from '../../utils/leafletIcon';

interface MapaSAFsProps {
    safs: ISAF[];
    onSafClick?: (saf: ISAF) => void; // <- callback opcional
}

const centroReserva: [number, number] = [-2.5, -58.7];
const reservaBounds: [number, number][] = [
    [-2.10, -59.40],
    [-2.10, -58.05],
    [-2.90, -58.05],
    [-2.90, -59.40],
];

// Componente interno para ter acesso ao map via hook
function MarkerWithAction({ saf, onSafClick }: { saf: ISAF; onSafClick?: (saf: ISAF) => void }) {
    const map = useMap();

    return (
        <Marker
            position={[saf.latitude, saf.longitude]}
            icon={DefaultIcon}
            eventHandlers={{
                click: () => {
                    // 1) dispara ação pro pai
                    onSafClick?.(saf);
                    // 2) centraliza e aproxima no ponto
                    map.flyTo([saf.latitude, saf.longitude], 14, { duration: 0.6 });
                },
            }}
        >
            <Popup>
                <strong>{saf.identificacao}</strong><br />
                Lat: {saf.latitude}<br />
                Long: {saf.longitude}
            </Popup>
        </Marker>
    );
}

export const MapaSAFs: React.FC<MapaSAFsProps> = ({ safs, onSafClick }) => {
    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <MapContainer center={centroReserva} zoom={9} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Polygon
                    positions={reservaBounds}
                    pathOptions={{ color: 'green', weight: 2, fillOpacity: 0, dashArray: '6 6' }}
                />

                {safs.map((saf) => (
                    <MarkerWithAction
                        key={saf.id ?? `${saf.identificacao}-${saf.latitude}-${saf.longitude}`}
                        saf={saf}
                        onSafClick={onSafClick}
                    />
                ))}
            </MapContainer>
        </div>
    );
};

