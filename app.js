import 'dotenv/config'
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import Routes from './routes/Routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import fs from 'fs';

app.get('/check-models', (req, res) => {
  const modelsPath = path.join(__dirname, 'Frontend', 'models');
  try {
    const files = fs.readdirSync(modelsPath);
    res.json({ path: modelsPath, files });
  } catch (err) {
    res.json({ error: err.message, path: modelsPath });
  }
});


app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.jsdelivr.net unpkg.com; " +
        "connect-src 'self' http://127.0.0.1:8545 cdn.jsdelivr.net unpkg.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: blob:; " +
        "media-src 'self' blob: mediastream:;"
    );
    next();
});

app.use(express.static(path.join(__dirname, 'Frontend')));

// API Routes
app.use('/api', Routes);

app.listen(PORT, () => {
  console.log(`Voting System Server running on http://localhost:${PORT}`);
});