const path = require('path');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

// Pfad zu deinem Service Account JSON
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const auth = new GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function appendValues(values) {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const valueInputOption = "RAW";
    const range = process.env.RANGE;
    const spreadsheetId = process.env.SHEET_ID;

    const resource = {
        values: values,
    };

    try {
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        });

        console.log(`${result.data.updates.updatedCells} cells appended.`);
        return result.data;
    } catch (e) {
        console.error('Fehler beim Schreiben in Google Sheet:', e);
        throw e;
    }
}

module.exports = {
    appendValues,
};
