export const GEAR_TEMPLATES = {
    hiking_day: {
        id: 'hiking_day',
        label: '一日郊山健行',
        categories: [
            {
                id: 'essentials',
                name: '基本裝備',
                items: [
                    { id: 'backpack', name: '雙肩背包 (15-25L)', checked: false },
                    { id: 'shoes', name: '登山鞋/健走鞋', checked: false },
                    { id: 'water', name: '飲用水 (1-2L)', checked: false },
                    { id: 'rain', name: '兩截式雨衣/雨傘', checked: false }
                ]
            },
            {
                id: 'navigation',
                name: '導航與通訊',
                items: [
                    { id: 'phone', name: '手機 & 離線地圖', checked: false },
                    { id: 'powerbank', name: '行動電源 & 線材', checked: false }
                ]
            }
        ]
    },
    hiking_multiday: {
        id: 'hiking_multiday',
        label: '百岳多日重裝',
        categories: [
            {
                id: 'sleep',
                name: '過夜系統',
                items: [
                    { id: 'tent', name: '帳篷', checked: false },
                    { id: 'sleeping_bag', name: '睡袋', checked: false },
                    { id: 'mat', name: '睡店', checked: false }
                ]
            },
            {
                id: 'cook',
                name: '炊煮系統',
                items: [
                    { id: 'stove', name: '爐頭', checked: false },
                    { id: 'gas', name: '瓦斯罐', checked: false },
                    { id: 'pot', name: '鍋具', checked: false }
                ]
            }
        ]
    },
    camping: {
        id: 'camping',
        label: '休閒露營',
        categories: [
            {
                id: 'living',
                name: '客廳區域',
                items: [
                    { id: 'tarp', name: '天幕/客廳帳', checked: false },
                    { id: 'chair', name: '折疊椅', checked: false },
                    { id: 'table', name: '蛋捲桌', checked: false }
                ]
            }
        ]
    }
};
