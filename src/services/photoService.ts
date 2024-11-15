import { getStorage } from 'firebase/storage';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface UploadResult {
    url: string;
}

export const uploadPhoto = async (base64: string, typePhoto: string): Promise<UploadResult> => {
    try {
        const base64Data = base64.split(',')[1];

        const byteString = atob(base64Data);

        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        const fileBlob = new Blob([uint8Array], { type: typePhoto }); 

        const storage = getStorage();
        const storageRef = ref(storage, `photos/${Date.now()}`); 
        const snapshot = await uploadBytesResumable(storageRef, fileBlob);

        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            url: downloadURL
        };
    } catch (error) {
        console.error("Error uploading photo", error);
        throw new Error("Error uploading photo");
    }
};



