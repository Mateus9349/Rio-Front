import axios, { AxiosInstance } from 'axios';

// Função para obter a URL da API
function getApiUrl(): string {
  const url = process.env.REACT_APP_API_URL;
  if (!url) {
    throw new Error('A variável de ambiente REACT_APP_API_URL não está definida.');
  }
  return url;
}

// Criação da instância do Axios com a URL base configurada
const http: AxiosInstance = axios.create({
  baseURL: getApiUrl() // Chama a função para obter a URL
});

export default http;