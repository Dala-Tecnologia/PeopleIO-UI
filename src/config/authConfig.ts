import type { Configuration, 
    PopupRequest, 
    RedirectRequest } from "@azure/msal-browser";

// Configurações do Azure AD (Entra ID)
export const msalConfig: Configuration = {
    auth: {
        clientId: "e67b8b24-4994-4b0a-bd95-d969f2edfc57", // Client ID do Frontend (peopleio-ui-dev)
        authority: "https://peopleioauth.ciamlogin.com/d86016d0-ba89-4553-a9ce-80757be65a93/v2.0", // Authority baseada no seu Tenant
        redirectUri: window.location.origin, // Geralmente http://localhost:5173 ou a URL de prod
    },
    cache: {
        cacheLocation: "sessionStorage", // Ou "localStorage"
        storeAuthStateInCookie: false,
    }
};

// Escopos necessários para obter o token para o Backend
export const apiRequest: PopupRequest | RedirectRequest = {
    scopes: ["api://8d35da06-7e8b-4276-ae61-0aa44faa4f9f/API.Access"]
};

// Escopos para o login inicial (geralmente openid, profile, offline_access são padrão, mas adicionamos o da API para consentimento)
export const loginRequest: PopupRequest | RedirectRequest = {
    scopes: ["openid", "profile", ...apiRequest.scopes || []]
};