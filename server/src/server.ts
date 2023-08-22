import express, { Express, Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const PORT:number = 8080;
const app:Express = express();
app.use(cors());

// Static Middleware
app.use('/static', express.static(__dirname + '/uploads'));

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: './src/uploads',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  },
});
const upload = multer({ storage });

// Ruta para obtener la imagen
app.get('/upload', (_req: Request, res: Response) => {
  
  const filenames = fs.readdirSync(__dirname + '/uploads');
  console.log(filenames);
  res.json(filenames[filenames.length - 1]);
})

// Ruta para cargar una imagen
app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
  }
  return res.status(200).json({ message: 'Imagen cargada exitosamente' });
});

app.listen( PORT, () => {
  console.log( `Example app listening on port: ${PORT}. Login in: http://localhost:${PORT}/upload` );
});