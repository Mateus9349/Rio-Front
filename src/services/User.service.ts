import { IUser } from '../interfaces/user.interface';
import api from './api.service';

export class UserService {
    static async login(email: string, senha: string): Promise<IUser> {
        try {
            const response = await api.post('/usuarios/login', { email, senha });

            const token = response.data.token;
            const payload = JSON.parse(atob(token.split('.')[1]));

            const userData: IUser = {
                id: payload.sub,
                nome: payload.nome || 'Usuário',
                email: payload.email,
                permissoes: payload.permissoes,
                token,
            };

            return userData;
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Erro ao fazer login';
            throw new Error(message);
        }
    }
}
