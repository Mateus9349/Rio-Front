export interface ICliente {
    id: string;
    nome: string;
    imagem?: string;
}

export const clientesMock: ICliente[] = [
    { id: "1", nome: "Cliente A" },
    { id: "2", nome: "Cliente B" },
    { id: "3", nome: "Cliente C" }
];
