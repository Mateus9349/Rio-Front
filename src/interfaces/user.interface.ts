export interface IUsuario {
    id: string;
    nome: string;
    email: string;
    senhaHash: string;
    permissoes: string[];
}

export const usuariosMock: IUsuario[] = [
    {
        id: "1",
        nome: "Admin",
        email: "admin@email.com",
        senhaHash: "hashedpassword123",
        permissoes: ["ADMIN", "USER"]
    },
    {
        id: "2",
        nome: "Usuário Comum",
        email: "user@email.com",
        senhaHash: "hashedpassword456",
        permissoes: ["USER"]
    }
];
