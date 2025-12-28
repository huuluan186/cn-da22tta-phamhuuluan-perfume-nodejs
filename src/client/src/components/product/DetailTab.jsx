const DetailTab = ({ product, selectedVariant  }) => {
    if (!product) return <p>Đang tải...</p>;
    // Tách scentNotes thành 3 phần 
    const scentParts = product.scentNotes
        ? product.scentNotes
            .split(";")                    // tách theo dấu ;
            .map(s => s.trim())            // bỏ khoảng trắng thừa
            .filter(s => s.length > 0)     // ← LOẠI BỎ hoàn toàn phần tử rỗng
            .filter(s => s !== ";")        // phòng trường hợp có ";;"
        : [];

    return (
        <div className="space-y-3">
            <table className='w-full text-gray-800'>
                <tbody>
                    {/* Mã hàng (SKU của variant đang chọn) */}
                    {selectedVariant && ( 
                        <tr className='h-9'> 
                            <td className="font-semibold w-40">Mã hàng: </td> 
                            <td className="">{selectedVariant.sku}</td> 
                        </tr> 
                    )}
                    {product?.brand?.name && ( 
                        <tr className='h-9'> 
                            <td className=" font-semibold w-40">Thương hiệu: </td> 
                            <td className="">
                                <a href='/' className='text-blue-600'>{product.brand.name}</a>
                            </td> 
                        </tr> 
                    )} 
                    {product?.origin && ( 
                        <tr className='h-9'> 
                            <td className=" font-semibold w-40">Xuất xứ: </td> 
                            <td className="">{product.origin}</td> 
                        </tr> 
                    )} 
                    {product?.releaseYear && ( 
                        <tr className='h-9'> 
                            <td className=" font-semibold w-40">Năm phát hành: </td> 
                            <td className="">{product.releaseYear}</td> 
                        </tr> 
                    )} 
                    {product?.fragranceGroup && ( 
                        <tr className='h-9'> 
                            <td className=" font-semibold w-40">Nhóm hương: </td> 
                            <td className="">{product.fragranceGroup}</td> 
                        </tr> 
                    )} 
                    {product?.style && ( 
                        <tr className='h-9'> 
                            <td className=" font-semibold w-40">Phong cách: </td> 
                            <td className="">{product.style}</td> 
                        </tr> 
                    )} 
                </tbody>
            </table>
            {scentParts?.length > 0 && ( 
                <div className="max-w-4xl text-justify">
                    <div className="space-y-1.5 pb-5"> 
                        {scentParts.map((part, index) => ( 
                            <p key={index}>{part}</p> 
                        ))} 
                    </div> 
                </div>
            )}
            {product?.description && (
                <div className="max-w-4xl">
                    <div
                        className="prose prose-sm text-gray-700 leading-relaxed text-justify whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </div>
            )}
        </div>
    )
}

export default DetailTab
