/**
 * 戀愛九宮格 — Google Apps Script 後端
 * 試算表：九宮格 / 工作表1
 * 欄位：A 格號 | B 地點 | C 更新時間（第 2–10 列對應第 1–9 格）
 */
const SHEET_ID = '1JFBx7ozG-KvdvVg3TzdXjUToM0mUHIcfb5wjdshk79s';
const TAB = '工作表1';
const TZ = 'Asia/Taipei';

function sheet_() {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
  if (sh.getRange('A1').getValue() === '') {
    sh.getRange('A1:C1').setValues([['格號', '地點', '更新時間']]);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function list_() {
  const rows = sheet_().getRange('A2:C10').getDisplayValues();
  return rows.map(r => ({ place: String(r[1] || ''), updated: String(r[2] || '') }));
}

// GET ?action=list → { ok, cells:[{place, updated} x9] }
function doGet(e) {
  try {
    return json_({ ok: true, cells: list_() });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// POST body (text/plain JSON): { action:"save", index:1-9, place:"..." }
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const body = JSON.parse(e.postData.contents || '{}');
    const index = Number(body.index);
    if (!(index >= 1 && index <= 9)) throw new Error('index 必須是 1–9');
    const place = String(body.place || '').trim().slice(0, 60);
    const updated = place ? Utilities.formatDate(new Date(), TZ, 'yyyy/MM/dd HH:mm') : '';
    sheet_().getRange(index + 1, 1, 1, 3).setValues([[index, place, updated]]);
    return json_({ ok: true, index, place, updated });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
