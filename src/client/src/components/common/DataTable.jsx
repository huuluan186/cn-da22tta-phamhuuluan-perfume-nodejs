const DataTable = ({ columns = [], data = [], actions = [], loading = false }) => {
    const hasActions = actions?.length > 0;

    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto relative">
            {/* table-fixed để sticky + scroll hoạt động ổn định */}
            <table className="w-full table-fixed border-collapse text-sm">
                <thead className="bg-gray-100 text-gray-700 text-sm sticky top-0 z-10">
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className="px-5 py-4 text-left font-semibold"
                                style={{ width: col.width || 'auto', minWidth: col.minWidth || '150px' }}
                            >
                                {col.label}
                            </th>
                        ))}

                        {hasActions && (
                            <th
                                className="px-5 py-4 text-right font-semibold sticky right-0 bg-gray-100 z-20"
                                style={{ width: '180px', minWidth: '180px' }}
                            >
                                <div className="pr-4">Hành động</div>
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {loading && (
                        <tr>
                            <td
                                colSpan={columns.length + (hasActions ? 1 : 0)}
                                className="py-10 text-center text-gray-500"
                            >
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    )}

                    {!loading && data.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length + (hasActions ? 1 : 0)}
                                className="py-10 text-center text-gray-400"
                            >
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        data.map((row, rowIndex) => (
                            <tr
                                key={row.id ?? rowIndex}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                {columns.map(col => (
                                    <td
                                        key={col.key}
                                        className="px-5 py-4 text-left align-top" // align-top để nội dung dài căn trên
                                        style={{ width: col.width || 'auto', minWidth: col.minWidth || '150px' }}
                                    >
                                        {/* Cho phép xuống dòng tự nhiên */}
                                        <div className="break-words">
                                            {col.render
                                                ? col.render(row, rowIndex)
                                                : row[col.key]}
                                        </div>
                                    </td>
                                ))}

                                {hasActions && (
                                    <td
                                        className="px-5 py-4 sticky right-0 bg-white z-10 shadow-[-4px_0_10px_-3px_rgba(0,0,0,0.1)]"
                                        style={{ width: '180px', minWidth: '180px' }}
                                    >
                                        <div className={
                                            actions.length > 3 
                                                ? "flex flex-col items-end gap-2 pr-4"   // ≥ 3 nút → xếp dọc, căn phải
                                                : "flex justify-end gap-2 pr-4"         // < 3 nút → xếp ngang như cũ
                                        }>
                                            {actions.map((action, i) => {
                                                if (action.show && !action.show(row)) return null;
                                                const ActionComponent = action.Component;
                                                return <ActionComponent key={i} row={row} />;
                                            })}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;