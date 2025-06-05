export interface IProprietario {
    id?: string;
    nome: string;
    telefone?: string;
    email?: string;
}

export const proprietariosMock: IProprietario[] = [
    { id: "1", nome: "Proprietário 1", telefone: "(92) 99999-9999", email: "prop1@email.com" },
    { id: "2", nome: "Proprietário 2", telefone: "(92) 98888-8888", email: "prop2@email.com" },
    { id: "3", nome: "Proprietário 3" }
];
