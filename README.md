# 戶外行程規劃助手 (Outdoor Trip Planner)

這是一個專為戶外活動設計的行程規劃網頁應用程式，協助團隊輕鬆管理多日登山或戶外旅遊的行程、裝備與資訊。

## ✨ 主要功能

- **行程管理 (Itinerary Management)**: 動態規劃每日行程，支援拖曳排序與時間計算。
- **裝備清單 (Gear List)**: 建立與管理個人及公用裝備清單，確保裝備齊全。
- **地圖整合 (Map Integration)**: 結合地圖功能，視覺化行程路線 (支援 GPX)。
- **角色權限 (Role-Based Access)**:
  - **管理員 (Admin)**: 擁有完整編輯權限。
  - **參加者 (Participant)**: 可查看敏感資訊（如預算、保險）並管理裝備。
  - **訪客 (Viewer)**: 僅能查看基本行程資訊。
- **響應式設計**: 支援桌面與行動裝置瀏覽 (Mobile-First 焦點面板)。

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

### 建置與佈署

```bash
# 建置專案
npm run build

# 佈署至 GitHub Pages
npm run deploy
```

## 🛠️ 技術棧

- **核心**: React 19, Vite
- **語言**: JavaScript (ES Modules)
- **樣式**: CSS Modules, Tailwind Merge, Lucide Icons
- **功能**:
  - `@dnd-kit`: 用於拖曳排序功能
  - `react-router-dom`: 路由管理
  - Firebase (規劃中/整合中): 後端資料庫整合

## 📄 授權

本專案採用 MIT 授權。
