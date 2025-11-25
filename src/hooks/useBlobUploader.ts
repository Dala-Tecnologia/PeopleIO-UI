export function useBlobUploader() {
  const containerUrl = import.meta.env.VITE_AZURE_BLOB_URL;


  async function uploadFile(file: File) {
    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const uploadUrl = `${containerUrl}/${fileName}`;

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type
      },
      body: file
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar arquivo para Azure Blob");
    }

    return {
      nomeArquivo: fileName,
      url: `${containerUrl}/${fileName}`,
      tipoMime: file.type,
      dataUpload: new Date().toISOString()
    };
  }

  return { uploadFile };
}
