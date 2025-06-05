export interface ISAF {
    id?: string;
    identificacao: string;
    latitude: number;
    longitude: number;
}

export const safsMock: ISAF[] = [
    { id: "1", identificacao: "SAF 101", latitude: -3.123456, longitude: -60.123456 },
    { id: "2", identificacao: "SAF 102", latitude: -2.987654, longitude: -61.987654 },
    { id: "3", identificacao: "SAF 103", latitude: -3.654321, longitude: -59.654321 }
];
