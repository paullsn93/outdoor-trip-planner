import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { nanoid } from 'nanoid';

export const storageService = {
    // 上傳圖片
    // path: 'trip_images/' + tripId
    async uploadImage(file, folderPath = 'uploads') {
        try {
            // 產生唯一檔名
            const fileName = `${nanoid()}_${file.name}`;
            const fullPath = `${folderPath}/${fileName}`;
            const storageRef = ref(storage, fullPath);

            // 上傳檔案
            const snapshot = await uploadBytes(storageRef, file);

            // 取得公開下載連結
            const downloadURL = await getDownloadURL(snapshot.ref);

            return {
                url: downloadURL,
                path: fullPath
            };
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw error;
        }
    }
};
