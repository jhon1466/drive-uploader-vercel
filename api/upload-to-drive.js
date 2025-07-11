const { google } = require('googleapis');
const formidable = require('formidable');
const fs = require('fs');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Error al procesar el archivo' });
    }

    // Carga las credenciales desde variables de entorno
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const uploadedLinks = [];

    const fileArray = Array.isArray(files.files) ? files.files : [files.files];

    for (const file of fileArray) {
      const fileMetadata = {
        name: file.originalFilename,
        parents: folderId ? [folderId] : [],
      };
      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.filepath),
      };

      try {
        const driveFile = await drive.files.create({
          resource: fileMetadata,
          media,
          fields: 'id,webViewLink',
        });

        // Hacer público el archivo
        await drive.permissions.create({
          fileId: driveFile.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });

        uploadedLinks.push(driveFile.data.webViewLink);
      } catch (e) {
        return res.status(500).json({ success: false, error: 'Error al subir a Drive: ' + e.message });
      }
    }

    res.status(200).json({ success: true, links: uploadedLinks });
  });
} 
