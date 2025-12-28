export const calcTotal = (items) => {
    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

export const calcDiscount = (total, discountType = null, discountValue = 0) => {
    total = Number(total) || 0
    discountValue = Number(discountValue) || 0

    if (!discountType || !discountValue) return total

    let final = total;

    if (discountType === 'percentage') {
        final = total - (total * discountValue / 100);
    }

    if (discountType === 'fixed') {
        final = total - discountValue;
    }

    // Không cho âm tiền
    if (final < 0) final = 0

    return Math.round(final * 100) / 100; // làm tròn 2 chữ số
}
