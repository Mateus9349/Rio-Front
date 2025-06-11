import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { ISAF } from '../../interfaces/SAF.interface';
import { DefaultIcon } from '../../utils/leafletIcon';

interface MapaSAFsProps {
    safs: ISAF[];
}

// Centro aproximado da RDS Uatumã
const centroReserva: [number, number] = [-2.5, -58.7];

// Limites aproximados para representar a RDS
const reservaBounds: [number, number][] = [
    [-2.10, -59.40], // Noroeste
    [-2.10, -58.05], // Nordeste
    [-2.90, -58.05], // Sudeste
    [-2.90, -59.40], // Sudoeste
];

export const MapaSAFs: React.FC<MapaSAFsProps> = ({ safs }) => {
    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <MapContainer center={centroReserva} zoom={9} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Traçado da RDS sem preenchimento */}
                <Polygon
                    positions={reservaBounds}
                    pathOptions={{
                        color: 'green',
                        weight: 2,
                        fillOpacity: 0,
                        dashArray: '6 6'
                    }}
                />

                {safs.map((saf, index) => (
                    <Marker
                        key={`${saf.id}-${saf.latitude}-${saf.longitude}-${index}`}
                        position={[saf.latitude, saf.longitude]}
                        icon={DefaultIcon}
                    >
                        <Popup>
                            <strong>{saf.identificacao}</strong><br />
                            Lat: {saf.latitude}<br />
                            Long: {saf.longitude}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
