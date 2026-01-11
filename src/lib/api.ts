import axios from 'axios';
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, apiRequest } from '../config/authConfig';

// Crie uma instância do MSAL para usar dentro do interceptor (fora do ciclo de vida do React)
const msalInstance = new PublicClientApplication(msalConfig);
let isMsalInitialized = false;

async function getAccessToken() {
    if (!isMsalInitialized) {
        await msalInstance.initialize();
        isMsalInitialized = true;
    }

    const account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];

    if (!account) {
        throw new Error("Nenhuma conta ativa encontrada. O usuário precisa fazer login.");
    }

    const request = {
        ...apiRequest,
        account: account,
    };

    try {
        // Tenta obter o token silenciosamente (cache ou refresh token)
        const response = await msalInstance.acquireTokenSilent(request);
        return response.accessToken;
    } catch (error) {
        // Se falhar (ex: sessão expirada), pode ser necessário login interativo
        console.warn("Falha ao obter token silenciosamente", error);
        throw error;
    }
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Ajuste para a URL da sua API .NET
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await getAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
        console.error("Erro ao anexar token:", error);
    }
    return config;
});