import nodemailer from 'nodemailer';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Tạo transporter (có thể dùng Gmail, SendGrid, Mailgun, SMTP server...)
const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc bỏ service nếu dùng SMTP custom
    auth: {
        user: process.env.EMAIL_USER,     // ví dụ: yourapp@gmail.com
        pass: process.env.EMAIL_PASS,     // App Password nếu dùng Gmail
    },
    // Nếu dùng SendGrid/Mailgun thì cấu hình khác
});

export const generateShortResetLink = async (userId, resetToken) => {
    const longUrl = `${process.env.CLIENT_URL}/account/reset/${userId}/${resetToken}`;

    try {
        const encodedUrl = encodeURIComponent(longUrl);
        const { data } = await axios.get(
            `https://tinyurl.com/api-create.php?url=${encodedUrl}`
        );
        return data;
    } catch (error) {
        console.error('TinyURL error:', error.response?.data || error.message);
        // fallback nếu TinyURL lỗi
        return longUrl;
    }
};

// Hàm gửi email reset password
export const sendResetPasswordEmail = async (user, resetToken) => {
    const resetLink = await generateShortResetLink(user.id, resetToken);

    const mailOptions = {
        from: `"Perfumora.vn" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Đặt lại mật khẩu tài khoản của bạn',
        text: `Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link sau để thực hiện (hiệu lực trong 15 phút):\n\n${resetLink}\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #07503D;">Yêu cầu đặt lại mật khẩu</h2>
                <p>Xin chào ${user.firstname || ''} ${user.lastname || ''},</p>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                <p>Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu (link chỉ có hiệu lực trong <strong>15 phút</strong>):</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #07503D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Đặt lại mật khẩu
                    </a>
                </div>
                <p>Hoặc copy link sau: <br/><a href="${resetLink}">${resetLink}</a></p>
                <p>Nếu bạn <strong>không yêu cầu</strong> đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <hr/>
                <small>Đây là email tự động, vui lòng không trả lời.</small>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset password email sent to:', user.email);
    } catch (error) {
        console.error('Lỗi gửi email reset password:', error);
        throw new Error('Không thể gửi email đặt lại mật khẩu');
    }
};