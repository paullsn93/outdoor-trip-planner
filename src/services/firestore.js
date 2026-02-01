import { db } from '../firebase';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp
} from 'firebase/firestore';

const TRIPS_COLLECTION = 'trips';

// 協助產生符合 Schema 的預設資料
export const createInitialTripData = (overrides = {}) => ({
    title: '未命名行程',
    category: 'hiking', // hiking, cycling, camping, travel
    status: 'planning', // planning, active, done
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    passwords: {
        admin_pwd: 'admin',
        participant_pwd: 'team',
        viewer_pwd: 'view'
    },
    is_private: false, // 是否包含敏感隱私資訊
    itinerary: [], // 每日行程陣列
    gearList: [],
    ...overrides
});

export const tripService = {
    // 獲取所有行程
    async getAllTrips() {
        try {
            const querySnapshot = await getDocs(collection(db, TRIPS_COLLECTION));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting trips: ", error);
            throw error; // Throw to let UI handle it
        }
    },

    // 獲取單一行程詳情
    async getTripById(id) {
        try {
            const docRef = doc(db, TRIPS_COLLECTION, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting trip: ", error);
            return null;
        }
    },

    // 儲存或更新行程 (包含天數資料)
    // 如果傳入的 tripData 缺少欄位，不會自動補全，請由前端確保資料完整性
    async saveTrip(tripId, tripData) {
        try {
            // 確保日期格式正確轉換 (如果是 Date 物件)
            const dataToSave = { ...tripData };
            if (dataToSave.startDate instanceof Date) dataToSave.startDate = Timestamp.fromDate(dataToSave.startDate);
            if (dataToSave.endDate instanceof Date) dataToSave.endDate = Timestamp.fromDate(dataToSave.endDate);

            dataToSave.lastUpdated = Timestamp.now();

            // 若沒有 ID 則新增，有 ID 則更新
            if (!tripId) {
                const docRef = await addDoc(collection(db, TRIPS_COLLECTION), dataToSave);
                return docRef.id;
            } else {
                const docRef = doc(db, TRIPS_COLLECTION, tripId);
                await setDoc(docRef, dataToSave, { merge: true });
                return tripId;
            }
        } catch (error) {
            console.error("Error saving trip: ", error);
            throw error;
        }
    },

    // 刪除行程
    async deleteTrip(tripId) {
        try {
            await deleteDoc(doc(db, TRIPS_COLLECTION, tripId));
        } catch (error) {
            console.error("Error deleting trip: ", error);
            throw error;
        }
    }
};
