import React, { useContext, useState } from 'react';
import styles from './Login.module.scss';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../services/User.service';
import { getErrorMessage } from '../../utils/errors';

export default function Login() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext deve ser usado dentro de um AuthProvider');
    }

    const navigate = useNavigate();
    const { login } = authContext;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            const userData = await UserService.login(username, password);
            login(userData);
            navigate('/home');
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro ao fazer login'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.loginContainer}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Verificando...' : 'Entrar'}
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </div>
        </main>
    );
}
