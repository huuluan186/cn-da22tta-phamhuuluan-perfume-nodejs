import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Pagination } from '../../components/index'
import { getMyOrders } from '../../store/actions/order'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { ORDERS_PER_PAGE } from '../../constants/pagination'

const formatPrice = (price) =>
    Number(price).toLocaleString('vi-VN') + '₫'

const OrderHistory = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [openOrderId, setOpenOrderId] = useState(null)
    const [page, setPage] = useState(1)
    const limit = ORDERS_PER_PAGE
    const hasPagination = true;
    const { orders } = useSelector(state => state.order)

    useEffect(() => {
        dispatch(getMyOrders({ page, limit, hasPagination }))
    }, [dispatch, page, limit, hasPagination])

    if (!orders?.data?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
                <p className="text-lg text-gray-500">
                    Bạn chưa có đơn hàng nào
                </p>
                <Button
                    text="Tiếp tục mua sắm"
                    width="w-auto"
                    rounded="rounded-lg"
                    onClick={() => navigate('/collections')}
                />
            </div>
        )
    }

    const toggle = (id) => {
        setOpenOrderId(prev => (prev === id ? null : id))
    }

    // const itemTotal = item.unitPrice * item.quantity

    // const discountAmount =
    //     (item.variant.originalPrice - item.unitPrice) * item.quantity


    return (
        <div className="max-w-6xl mx-auto py-8">
            <h2 className="text-2xl font-semibold mb-6">
                Lịch sử đặt hàng
            </h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 w-10"></th>
                            <th className="p-3 text-left">Mã đơn</th>
                            <th className="p-3 text-left">Ngày đặt</th>
                            <th className="p-3 text-left">Trạng thái</th>
                            <th className="p-3 text-left">Thanh toán</th>
                            <th className="p-3 text-right">Tổng tiền</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders?.data?.map(order => (
                            <>
                                {/* BASIC ROW */}
                                <tr
                                    key={order.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-3 text-center">
                                        <button onClick={() => toggle(order.id)}>
                                            {openOrderId === order.id ? <FiMinus /> : <FiPlus />}
                                        </button>
                                    </td>

                                    <td className="p-3 font-medium">
                                        #{order.id}
                                    </td>

                                    <td className="p-3">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>

                                    <td className="p-3 font-medium">
                                        {order.orderStatus}
                                    </td>

                                    <td className="p-3">
                                        {order.paymentMethod} – {order.paymentStatus}
                                    </td>

                                    <td className="p-3 text-right font-semibold">
                                        {formatPrice(order.totalAmount)}
                                    </td>
                                </tr>

                                {/* DETAIL ROW */}
                                {openOrderId === order.id && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={6} className="p-5 space-y-5">
                                            {/* PRODUCTS */}
                                            <div>
                                                <p className="font-semibold mb-3 text-base">SẢN PHẨM</p>

                                                {order.orderItems.map(item => {
                                                    const originalPrice = Number(item.variant?.originalPrice || 0)
                                                    const unitPrice = Number(item.unitPrice)
                                                    const quantity = item.quantity
                                                    const totalPrice = unitPrice * quantity
                                                    //const discountAmount = (originalPrice - unitPrice) * quantity

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="flex justify-between gap-6 border-b py-3 text-sm"
                                                        >
                                                            {/* LEFT */}
                                                            <div>
                                                                <p className="font-medium">
                                                                    {item.variant?.product?.name}
                                                                </p>

                                                                <p className="text-gray-500">
                                                                    {item.variant?.volume}ml × {quantity}
                                                                </p>

                                                                {/* {item.variant?.discountPercent > 0 && (
                                                                    <p className="text-xs text-red-500">
                                                                        Giảm {item.variant.discountPercent}% (
                                                                        -{formatPrice(discountAmount)})
                                                                    </p>
                                                                )} */}
                                                            </div>

                                                            {/* RIGHT */}
                                                            <div className="text-right space-y-1">
                                                                {originalPrice > unitPrice && (
                                                                    <p className="line-through text-gray-400 text-xs">
                                                                        {formatPrice(originalPrice)}
                                                                    </p>
                                                                )}

                                                                <p className="font-medium">
                                                                    {formatPrice(unitPrice)} × {quantity}
                                                                </p>

                                                                <p className="font-semibold text-primary">
                                                                    {formatPrice(totalPrice)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>


                                            {/* PAYMENT */}
                                            <div className="text-sm border-b pb-5">
                                                <p><b>Thanh toán:</b> {order.paymentMethod}</p>
                                                <p><b>Trạng thái:</b> {order.paymentStatus}</p>
                                                {order.paymentTransactionId && (
                                                    <p>
                                                        <b>Mã giao dịch thanh toán ZaloPay: </b> {order.paymentTransactionId}
                                                    </p>
                                                )}
                                            </div>

                                            {/* ADDRESS */}
                                            <div className="text-sm space-y-1">
                                                <p className="font-semibold text-base">THÔNG TIN GIAO HÀNG</p>

                                                <p>
                                                    <b>Họ tên:</b> {order.address?.receiverName}
                                                </p>

                                                <p>
                                                    <b>SĐT:</b> {order.address?.phone}
                                                </p>

                                                <p>
                                                    <b>Địa chỉ:</b>{" "}
                                                    {order.address?.addressLine},{" "}
                                                    {order.address?.ward?.name},{" "}
                                                    {order.address?.ward?.province?.name}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pt-10">
                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil((orders?.total || orders?.data?.length || 0)/limit) }
                        onPageChange={setPage}
                    />
                </div>
        </div>
    )
}

export default OrderHistory
