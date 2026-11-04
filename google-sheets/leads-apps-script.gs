/**
 * Lead form -> Google Sheet (+ instant email alert).
 * Paste into the Sheet: Extensions > Apps Script, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone). Copy the /exec URL into LEAD_SHEET_URL in index.html.
 */
const SHEET_NAME = "Leads";
const NOTIFY_EMAIL = ""; // leave empty to send alerts to the Google account that owns the script

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return json({ ok: true }); // honeypot (bots)

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(["Timestamp", "Name", "Email", "Phone", "Source button", "Page",
                    "utm_source", "utm_medium", "utm_campaign", "Referrer", "Status"]);
      sh.setFrozenRows(1);
    }
    const clean = v => String(v || "").slice(0, 300).replace(/^[=+\-@]/, "'$&"); // block formula injection
    const row = [new Date(), clean(p.name), clean(p.email), clean(p.phone), clean(p.source), clean(p.page),
                 clean(p.utm_source), clean(p.utm_medium), clean(p.utm_campaign), clean(p.referrer), "New"];
    sh.appendRow(row);

    const to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
    if (to) {
      MailApp.sendEmail(to, "New lead: " + row[1],
        "Name: " + row[1] + "\nEmail: " + row[2] + "\nPhone: " + row[3] +
        "\nButton: " + row[4] + "\nPage: " + row[5] + "\nSheet: " + ss.getUrl());
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
