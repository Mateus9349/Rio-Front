import React, { useContext, useState } from 'react';
import styles from './Login.module.scss';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const authContext = useContext(AuthContext);

    // Verifica se o contexto está definido
    if (!authContext) {
        throw new Error('AuthContext deve ser usado dentro de um AuthProvider');
    }

    const navigate = useNavigate();
    const { login } = authContext;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        if (!username || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        // Simula o login com os dados do usuário
        const userData = {
            id: '1', // Substitua por um valor real, se necessário
            nome: username,
        };

        login(userData);
        setError('');
        navigate('/home');
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
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Entrar</button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </div>
        </main>
    );
}
