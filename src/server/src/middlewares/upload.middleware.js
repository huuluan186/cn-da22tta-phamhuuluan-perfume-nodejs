import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chỉ cho phép ảnh
const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

/**
 * Tạo storage cho folder cụ thể
 */
const createStorage = (folder) => {
    const uploadDir = path.join(__dirname, `../public/uploads/${folder}/`);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    return multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, uniqueSuffix + ext);
        }
    });
};

/**
 * Middleware upload single file
 * @param {string} folder - tên thư mục con trong /uploads
 */
export const uploadSingleImage = (folder = 'default') => {
    const storage = createStorage(folder);
    const upload = multer({ storage, fileFilter: imageFilter });

    return (req, res, next) => {
        upload.single('image')(req, res, (err) => {
            if (err) return res.status(400).json({ err: 1, msg: 'File upload failed: ' + err.message });
            if (req.file) req.body.image = `/uploads/${folder}/${req.file.filename}`;
            next();
        });
    };
};

/**
 * Middleware upload nhiều file
 * @param {string} folder - tên thư mục con trong /uploads
 * @param {number} maxCount - số file tối đa
 */
export const uploadMultipleImages = (folder = 'default', maxCount = 5) => {
    const storage = createStorage(folder);
    const upload = multer({ storage, fileFilter: imageFilter });

    return (req, res, next) => {
        // Dùng .any() để nhận tất cả file trước
        upload.any()(req, res, (err) => {
            if (err) return res.status(400).json({ err: 1, msg: 'File upload failed: ' + err.message });
            
            if (req.files && req.files.length) {
                // Chỉ lấy maxCount file đầu tiên
                const filesToUse = req.files.slice(0, maxCount);
                req.body.images = filesToUse.map(file => `/uploads/${folder}/${file.filename}`);
            }
            next();
        });
    };
};

