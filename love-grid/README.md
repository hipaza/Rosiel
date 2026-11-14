# 💗 我們的戀愛九宮格

甜美戀愛風的九宮格網頁。點一格就能填寫或修改地點，資料存在 Google Sheet。

## 檔案結構

| 檔案 | 用途 |
|---|---|
| `index.html` | 網頁本體 |
| `config.js` | **唯一要改的地方**：Apps Script 網址 |
| `.nojekyll` | 讓 GitHub Pages 原封不動輸出檔案 |
| `apps-script/Code.gs` | 貼到 Google Apps Script 的後端程式（不會在網頁中執行） |

## 1. 部署 Apps Script（後端）

1. 打開試算表 → **擴充功能 → Apps Script**
2. 貼上 `apps-script/Code.gs` 的內容並存檔
3. **部署 → 新增部署作業 → 網頁應用程式**
   - 執行身分：**我**
   - 誰可以存取：**所有人**
4. 複製 `https://script.google.com/macros/s/.../exec` 網址

> 之後如果修改了 Code.gs，要到 **部署 → 管理部署作業 → 編輯 → 版本：新版本**，網址才會套用新程式。

## 2. 填入網址

編輯 `config.js`：

```js
window.LOVE_GRID_CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec"
};
```

## 3. 上傳到 GitHub Pages

1. 在 GitHub 建立新的 repository（例如 `love-grid`），設為 Public
2. **Add file → Upload files**，把這個資料夾裡**所有檔案**拖進去（包含 `.nojekyll`）→ Commit
3. **Settings → Pages → Build and deployment**
   - Source：**Deploy from a branch**
   - Branch：**main** / **/(root)** → Save
4. 等 1–2 分鐘，網址會是 `https://<你的帳號>.github.io/love-grid/`

> 用網頁上傳時 macOS 可能會隱藏 `.nojekyll`；少了它通常也能正常運作。

## 注意

- 拿到網頁網址的人都能修改九宮格內容。
- Public repo 的 `config.js` 會公開 Apps Script 網址，等同公開編輯權限。只想給特定人用的話，就不要到處分享網址。
- 試算表本身不用開放「所有人可編輯」，因為 Apps Script 是用你的身分寫入的。
