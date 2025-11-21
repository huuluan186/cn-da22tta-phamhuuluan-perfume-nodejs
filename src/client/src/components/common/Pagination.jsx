const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange, scrollRef, className = '' }) => {
    if (totalPages <= 1) return null; // không hiển thị phân trang nếu chỉ có 1 trang

    // Tạo danh sách số trang hiển thị (giới hạn 5 nút, với "...")
    const getPageNumbers = () => {
        const delta = 2;                   // luôn show 2 trang hai bên của trang hiện tại
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }
        if (currentPage - delta > 2) range.unshift('...');
        if (currentPage + delta < totalPages - 1) range.push('...');
        range.unshift(1);
        if (totalPages > 1) range.push(totalPages);
        return range;
    };

    const handlePageChange = (page) => {
        if (typeof page === 'number' && page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
            if (scrollRef?.current) {
                const offset = -200;
                const top = scrollRef.current.getBoundingClientRect().top + window.scrollY + offset;

                window.scrollTo({
                    top,
                    behavior: "smooth"
                });
            }
        }
    };

    return (
        <div className={`flex justify-center items-center gap-2 ${className}`}>
            {/* Nút Prev */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`pr-3 transition-all duration-300 text-xs ${
                    currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'hover:text-red-600'
                }`}
            >
                {"<<"}
            </button>

            {/* Số trang */}
            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    disabled={page === '...'}
                    className={`w-6 h-6 rounded-full font-medium text-sm transition-all duration-300 flex justify-center items-center ${
                        page === currentPage
                            ? 'bg-primary text-white shadow-lg scale-105'
                            : page === '...'
                                ? 'text-gray-400 cursor-default'
                                : 'bg-white border border-gray-300 hover:bg-primary hover:text-white hover:shadow'
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Nút Next */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`pl-3 transition-all duration-300 text-xs ${
                    currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'hover:text-red-600'
                }`}
            >
                {">>"}
            </button>
        </div>
    );
};

export default Pagination;