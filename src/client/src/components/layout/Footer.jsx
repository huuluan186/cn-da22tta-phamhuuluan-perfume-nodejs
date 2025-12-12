import {footerItems, methodPayment, socialMedia, contactItems} from "../../constants/footerItems"

const Footer = () => {
    return (
        <div>
            <div className='container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pt-8 pb-8 min-h-[320px]'>
                {/* 3 cột đầu: thông tin link */}
                {footerItems && footerItems.length > 0 && footerItems.map((col) => ( 
                    <div key={col.title}>
                        <h3 className="font-bold uppercase mb-3">| {col.title}</h3>
                        <ul className="flex flex-col space-y-1">
                            {col.items && col.items.length > 0 && col.items.map((item, index) => (
                                <li key={index}>
                                    {item.type === 'a' ? (  
                                        <a href={item.href} className="hover:text-yellow-400 cursor-pointer">
                                            {item.label}
                                        </a>
                                    ) : (
                                        <span>{item.label}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))} 

                {/* --- Thông tin liên hệ --- */}
                <div>
                    <h3 className="font-bold uppercase mb-3">| Thông tin liên hệ</h3>
                    <ul className="py-1">
                        {contactItems.map((item, i) =>
                            item.type === "a" ? (
                                <li key={i}>
                                    <a
                                        href={item.href}
                                        className="hover:text-gray-200 transition"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ) : (
                                <li key={i}>{item.label}</li>
                            )
                        )}
                    </ul>
                </div>
                {/* --- Kết nối với chúng tôi --- */}
                <div className="space-y-10">
                    <div className="text-center md:text-left">
                        <h3 className="font-bold uppercase mb-3">| Kết nối với chúng tôi</h3>
                        <div className="flex justify-center md:justify-start gap-4">
                            {socialMedia.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={social.img}
                                        alt={social.label}
                                        className="w-10 h-10 hover:scale-110 transition-transform duration-200"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold uppercase mb-2">| Phương thức thanh toán</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            {methodPayment.map((method, i) => (
                                <img
                                    key={i}
                                    src={method.img}
                                    alt={method.label}
                                    title={method.label}
                                    className="w-14 h-10 bg-white rounded object-contain p-1"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div> 
            <div className='bg-secondary h-12 flex items-center justify-center'>
                <p>Phạm Hữu Luân - 110122016 | Đồ án chuyên ngành ©{new Date().getFullYear()} | Perfumora.vn</p>
            </div>
        </div>
    )
}

export default Footer
