export function useBlobUploader() {
  const rawSas = import.meta.env.VITE_AZURE_SAS_TOKEN ?? "";
  const sasToken = rawSas.startsWith("?") ? rawSas.slice(1) : rawSas;
  const rawContainer = import.meta.env.VITE_AZURE_BLOB_URL ?? "";
  const containerUrl = rawContainer.replace(/\/+$/, "");

  async function uploadFile(file: File, filename: string, cpf: string) {
    if (!sasToken || !containerUrl) {
      throw new Error(
        "Variáveis de ambiente VITE_AZURE_SAS_TOKEN e VITE_AZURE_BLOB_URL não configuradas"
      );
    }

    const containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME ?? "";

    const baseContainerUrl = containerUrl.endsWith(`/${containerName}`)
      ? containerUrl
      : `${containerUrl}/${containerName}`;

    const remotePath = `${baseContainerUrl}/${encodeURIComponent(
      cpf
    )}/${encodeURIComponent(filename)}`;

    const url = `${remotePath}?${sasToken}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao fazer upload: ${response.status} ${response.statusText}`
      );
    }

       return remotePath;
  }
  return { uploadFile };
}
