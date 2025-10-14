import express from 'express';
import cors from 'cors'
import connectDatabase from './src/config/connectDB.js';
import mainRouter from './src/routes/index.route.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express()

app.use(cors({
    origin:process.env.CLIENT_URL,
    methods:["POST","GET","PUT","DELETE"]
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// chỉ mount /api một lần duy nhất
app.use('/api', mainRouter);

// optional route để test server
app.use('/', (req, res) => {
    res.send('✅ Server is running...');
});

const port = process.env.PORT || 5000;

connectDatabase().then(async () => {
    app.listen(port, () => {
        console.log(`Website listening on port ${port}`);
    });
});
