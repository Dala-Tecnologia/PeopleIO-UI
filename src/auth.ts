import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from './config/authConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

// Inicializa o MSAL assim que o módulo é carregado
msalInstance.initialize().catch(error => {
    console.error("MSAL initialization failed:", error);
});
