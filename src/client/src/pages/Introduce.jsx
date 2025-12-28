
const Introduce = () => {
    return (
        <div className="container bg-contentBg py-8 space-y-6">
            {/* Header */}
            <header className="text-center">
                <h1 className="text-3xl font-bold mb-2">Chào mừng đến với Perfumora</h1>
                <p className="text-gray-600">
                    Nơi trải nghiệm những mùi hương đầy cảm xúc và cá tính. Hơn cả thơm và đẹp, nước hoa chính là dấu ấn riêng của bạn.
                </p>
            </header>

            {/* Giới thiệu trải nghiệm */}
            <section>
                <h2 className="text-xl font-semibold mb-1">Trải nghiệm cảm xúc</h2>
                <p className="text-gray-700">
                    Mỗi mùi hương tại Perfumora là một hành trình, nâng niu cảm xúc tự do, mạnh mẽ và tinh tế.
                </p>
                <p className="text-gray-700">
                    Chúng tôi chọn lọc những hương thơm độc đáo, từ cổ điển đến hiện đại, để bạn tìm thấy bản ngã qua từng giọt nước hoa.
                </p>
            </section>

            {/* Giá trị của Perfumora */}
            <section>
                <h2 className="text-xl font-semibold mb-1">Giá trị của Perfumora</h2>
                <p className="text-gray-700">
                    Chúng tôi mang đến mùi hương chất lượng cao, trải nghiệm mua sắm dễ dàng, và tôn vinh cá tính riêng của mỗi khách hàng.
                </p>
                <p className="text-gray-700">
                    Hướng đến cảm xúc và thẩm mỹ, Perfumora không chỉ là nước hoa, mà là dấu ấn của bạn.
                </p>
            </section>

            {/* Kêu gọi khám phá */}
            <section>
                <h2 className="text-xl font-semibold mb-1">Khám phá ngay</h2>
                <p className="text-gray-700">
                Hãy để Perfumora đồng hành cùng bạn trong hành trình tìm kiếm mùi hương thể hiện bản ngã và phong cách riêng.
                </p>
            </section>
        </div>
    );
};

export default Introduce;
