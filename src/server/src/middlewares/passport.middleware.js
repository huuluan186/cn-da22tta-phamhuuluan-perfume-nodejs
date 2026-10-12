import passport from "passport";

// Strategy chỉ được đăng ký khi có đủ CLIENT_ID/CLIENT_SECRET (xem passport.config.js).
// Thiếu env => trả lỗi rõ ràng thay vì để passport ném "Unknown authentication strategy" (500).
const oauth = (name, scope) => (req, res, next) => {
    if (!passport._strategy(name)) {
        console.error(`[OAuth] Thiếu ${name.toUpperCase()}_CLIENT_ID / ${name.toUpperCase()}_CLIENT_SECRET trong biến môi trường`);
        return res.status(503).json({ err: 1, msg: `Đăng nhập ${name} chưa được cấu hình trên server` });
    }
    return passport.authenticate(name, {
        scope,
        session: false,
        failureRedirect: "/api/auth/login"
    })(req, res, next);
};

// Google middleware
export const googleAuth = oauth("google", ["profile", "email"]);

// Facebook middleware
export const facebookAuth = oauth("facebook", ["public_profile"]);
