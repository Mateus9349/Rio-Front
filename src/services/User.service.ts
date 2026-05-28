import { IUser } from '../interfaces/user.interface';
import { getErrorMessage } from '../utils/errors';
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
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, 'Erro ao fazer login'));
        }
    }
}
