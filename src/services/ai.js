// Simulate Gemini API Call
// In production, this would use fetch() to call the Gemini API endpoint

export const generateRainPlan = async (location, activityType) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockResponse = {
                hiking: `【${location} 雨天備案 - 登山篇】\n建議立即撤退至海拔較低的登山口。若雨勢過大，可前往附近的「${location}生態教育館」或「遊客中心」避雨。\n\n替代室內行程：\n1. 檜木博物館\n2. 溫泉山莊休息`,
                cycling: `【${location} 雨天備案 - 單車篇】\n路面濕滑危險，建議暫停騎行。最近的補給站/休息點位於 2km 外。\n\n替代方案：\n聯繫接駁車運送車輛，人先前往咖啡廳。`,
                camping: `【${location} 雨天備案 - 車宿/露營篇】\n目前的營地排水狀況可能不佳。建議轉移至有雨棚的 B 區營位，或前往附近的「${location}停車場」過夜（需注意法規）。`
            };

            resolve(mockResponse[activityType] || mockResponse.hiking);
        }, 1500);
    });
};
