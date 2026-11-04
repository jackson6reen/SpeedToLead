# Lead form → Google Sheets

1. Create a new Google Sheet (e.g. "SpeedToLead Leads").
2. Extensions → Apps Script. Delete the sample code, paste `leads-apps-script.gs`, save.
3. Deploy → New deployment → type **Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and approve the permissions.
4. Copy the Web app URL (ends with `/exec`) and put it in `LEAD_SHEET_URL` near the bottom of `index.html`.

Every submission adds a row to the "Leads" tab and emails you an alert.
