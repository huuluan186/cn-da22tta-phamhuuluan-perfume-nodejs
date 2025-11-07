import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'
import connectDatabase from './src/config/connectDB.js';
import mainRouter from './src/routes/index.route.js';
import passport from './src/config/passport.config.js';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express()

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true, // cho phép gửi cookie hoặc auth headers có credentials
}))

app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Cho phép FE truy cập ảnh trong thư mục public/uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'src/public/uploads')));
app.use('/sample_images', express.static(path.join(process.cwd(), 'src/public/sample_images')));

// 🚫 Ngăn cache cho toàn bộ response API
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
}, mainRouter)
// chỉ mount /api một lần duy nhất
app.use(passport.initialize());
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
