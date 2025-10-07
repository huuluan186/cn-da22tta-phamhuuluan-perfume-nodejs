const CartDropdownContent = ({ items }) => {
    if (!items || items.length === 0) {
        return (
            <div className="py-1 text-gray-500 italic text-sm">
                Không có sản phẩm nào trong giỏ hàng.
            </div>
        );
    }

    return (
        <ul className="flex flex-col w-full overflow-y-auto">
        {items.map(item => (
            <li key={item.id} className="py-2 border-b border-gray-300 flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>{item.price.toLocaleString()}₫</span>
            </li>
        ))}
        </ul>
    );
};

export default CartDropdownContent;
