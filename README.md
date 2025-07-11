# Drive Uploader para Vercel

Este backend permite recibir archivos y subirlos automáticamente a Google Drive usando la API de Google, funcionando en Vercel.

## Estructura del proyecto

```
drive-uploader-vercel/
├── api/
│   └── upload-to-drive.js
├── package.json
├── .gitignore
└── README.md
```

## Pasos para desplegar

1. **Crea un proyecto en Google Cloud:**
   - Habilita la API de Google Drive.
   - Crea credenciales de tipo "Cuenta de servicio" y descarga el archivo JSON.
   - Comparte la carpeta de destino en tu Google Drive con el email de la cuenta de servicio.

2. **Prepara las variables de entorno en Vercel:**
   - `GOOGLE_CREDENTIALS_JSON`: Pega el contenido completo del archivo JSON de Google (como string).
   - `GOOGLE_DRIVE_FOLDER_ID`: El ID de la carpeta de Drive donde subirás los archivos (opcional).

3. **Sube el proyecto a GitHub.**

4. **Despliega el proyecto en Vercel** conectando tu repositorio.

5. **Usa la URL de tu endpoint** para subir archivos desde tu web:
   - Ejemplo: `https://tu-proyecto-vercel.vercel.app/api/upload-to-drive`

## Notas
- El endpoint acepta peticiones POST con archivos (multipart/form-data).
- Los archivos subidos se hacen públicos automáticamente.
- Si tienes dudas, ¡pide ayuda al asistente! 