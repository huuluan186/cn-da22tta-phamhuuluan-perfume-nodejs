import { useState } from "react";
import { toast } from "react-toastify";
import { InputField, Button } from "../components";
import { apiSentContactMessage } from "../api/contact";

const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            setLoading(true);
            const res = await apiSentContactMessage(formData);

            if (res.err === 0) {
                toast.success("Gửi liên hệ thành công!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                toast.error(res.msg || "Gửi liên hệ thất bại!");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi gửi liên hệ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 container bg-contentBg">
            <div className="grid md:grid-cols-12 gap-8">
                {/* Cột trái: thông tin liên hệ + bản đồ */}
                <div className="md:col-span-4 space-y-4">
                    <h2 className="text-xl font-semibold">Liên hệ</h2>
                    <p>📍 126 Nguyễn Thiện Thành, phường Trà Vinh, tỉnh Vĩnh Long</p>
                    <p>📞 0123 456 789</p>
                    <p>✉️ luanphamhuu2004@gmail.com</p>
                    <div className="mt-4 w-full h-64">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.126073441039!2d106.34394437353973!3d9.923456874350201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0175ea296facb%3A0x55ded92e29068221!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBUcsOgIFZpbmg!5e0!3m2!1svi!2s!4v1766066300719!5m2!1svi!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Map"
                        ></iframe>
                    </div>
                </div>

                {/* Cột phải: form gửi liên hệ */}
                <div className="md:col-span-8">
                    <h2 className="text-xl font-semibold mb-4">Gửi thông tin</h2>
                    <p className="mb-4 text-gray-600">
                        Bạn hãy điền nội dung tin nhắn vào form dưới đây và gửi cho chúng tôi. Chúng tôi sẽ trả lời bạn sau khi nhận được.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Họ tên + Email trên 1 hàng */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <InputField
                                label="Họ tên"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            </div>

                            {/* Nội dung */}
                            <InputField
                                label="Nội dung"
                                name="message"
                                type="textarea"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />

                            <Button
                                type="submit"
                                width="w-auto"
                                text={loading ? "Đang gửi..." : "Gửi tin nhắn"}
                                hoverBg='hover:none'
                                hoverText="hover:none"
                                disabled={loading}
                            />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
