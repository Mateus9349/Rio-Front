export interface IUser {
    id?: string;
    nome: string;
    email: string;
    permissoes?: string[];
    token?: string;
}


export const usuariosMock: IUser[] = [
    {
        id: "1",
        nome: "Admin",
        email: "admin@email.com",
        token: "hashedpassword123",
        permissoes: ["ADMIN", "USER"]
    },
    {
        id: "2",
        nome: "Usuário Comum",
        email: "user@email.com",
        token: "hashedpassword456",
        permissoes: ["USER"]
    }
];
