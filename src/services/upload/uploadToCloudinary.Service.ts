import UploadResult from "../../interfaces/uploadInterfaces/uploadResult.Interface";
import UploadSignatureResponse from "../../interfaces/uploadInterfaces/uploadSignatureResponse.Interface";
import api from "../../api/apiClient";

/**
 * Obtém a assinatura segura do backend para upload no Cloudinary.
 */

export async function getCloudinarySignature(): Promise<UploadSignatureResponse> {
    const response = await api.get<UploadSignatureResponse>('/upload/signature');

    if (!response) {
        throw new Error('Erro: resposta inválida ao obter assinatura do Cloudinary');
    }

    return response;
}


/**
 * Faz upload direto para o Cloudinary.
 * @param file O arquivo a ser enviado.
 * @param onProgress Acompanhar progresso do upload.
 */
export async function uploadImageToCloudinary(
    file: File,
    onProgress?: (percent: number) => void
): Promise<UploadResult> {
    const sig = await getCloudinarySignature();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.apiKey);
    formData.append('timestamp', sig.timestamp.toString());
    formData.append('upload_preset', sig.uploadPreset);
    formData.append('signature', sig.signature);
    formData.append('folder', sig.folder);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                const result: UploadResult = {
                    secure_url: data.secure_url,
                    public_id: data.public_id,
                };
                resolve(result);
            } else {
                reject(new Error(`Erro Cloudinary: ${xhr.status} - ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => reject(new Error('Falha de rede durante upload'));
        xhr.send(formData);
    });
}