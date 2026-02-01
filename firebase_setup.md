# Firebase 設定指南

您已成功建立 Firebase 專案，請按照以下步驟取得 `.env` 所需的設定值，並啟用資料庫功能。

## 第一步：註冊 Web 應用程式 (取得 API Keys)

1. 在您的 Firebase 控制台首頁 (您提供的截圖畫面)，點擊 **「添加應用 (Add app)」** 按鈕下方的 **`</>` (Web)** 圖示。
2. **註冊應用程式**：
   - **應用暱稱**：輸入 `Outdoor Planner` (或任意名稱)。
   - **Firebase Hosting**：目前可以先不勾選。
   - 點擊 **「註冊應用 (Register app)」**。
3. **複製設定**：
   - 註冊後，您會看到一段程式碼 `const firebaseConfig = { ... };`。
   - 請將其中的值對應填入您的 `.env` 檔案（請參考下方對照表）。

### `.env` 填寫對照表

| `.env` 變數名稱 | `firebaseConfig` 對應欄位 |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

---

## 第二步：建立 Firestore 資料庫 (重要！)

為了讓行程存檔功能運作，您必須手動啟用資料庫：

1. 在左側選單中，點擊 **「構建 (Build)」** -> **「Firestore Database」**。
2. 點擊 **「建立資料庫 (Create Database)」**。
3. **安全規則設定**：
   - 選擇 **「以測試模式啟動 (Start in test mode)」**。
   - *注意：這允許任何人讀寫您的資料庫（適合開發測試用）。正式上線前我們再來修改規則。*
4. **位置設定**：
   - 選擇離台灣較近的節點 (例如 `asia-east1` 或預設值皆可)。
5. 等待建立完成後，您的應用程式就可以正常讀寫資料了！

---

## 第三步：啟用 Storage 圖片儲存功能 (NEW!)

為了讓行程卡片可以上傳圖片，請執行以下步驟：

1. 在左側選單中，點擊 **「構建 (Build)」** -> **「Storage」**。
2. 點擊 **「開始使用 (Get started)」**。
3. **安全規則設定**：
   - 同樣選擇 **「以測試模式啟動 (Start in test mode)」**。
   - 點擊 **「下一步 (Next)」**。
4. **雲端儲存位置**：
   - 保持預設即可，點擊 **「完成 (Done)」**。
5. 等待系統建立 Bucket 後，即完成設定！

---

## 第四步：驗證

1. 確認 `.env` 檔案已儲存。
2. 重啟開發伺服器：
   - 在終端機按 `Ctrl + C` 停止。
   - 再次執行 `npm run dev`。
3. 回到網頁，點擊「儲存行程」，應會看到「行程已儲存至雲端！」的提示。
