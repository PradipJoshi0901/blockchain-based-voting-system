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

// ✅ Fix ethers.js CSP eval() error
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.jsdelivr.net; " +
        "connect-src 'self' http://127.0.0.1:8545 cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data:;"
    );
    next();
});

app.use(express.static(path.join(__dirname, 'Frontend')));

// API Routes
app.use('/api', Routes);

app.listen(PORT, () => {
  console.log(`Voting System Server running on http://localhost:${PORT}`);
});