const DataTable = ({ columns, data, actions }) => {
    const hasActions = actions?.length > 0;

    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto relative">
            <table className="min-w-full border-collapse text-sm">
                {/* HEADER */}
                <thead className="bg-gray-100 text-gray-700 text-sm sticky top-0 z-10">
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className="px-4 py-3 text-center font-semibold whitespace-nowrap"
                            >
                                {col.label}
                            </th>
                        ))}

                        {hasActions && (
                            <th
                                className="px-4 py-3 text-center font-semibold sticky right-0 bg-gray-100 z-20 shadow-[-2px_0_6px_-2px_rgba(0,0,0,0.1)]"
                            >
                                Hành động
                            </th>
                        )}
                    </tr>
                </thead>

                {/* BODY */}
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={row.id ?? rowIndex}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            {columns.map(col => (
                                <td
                                    key={col.key}
                                    className="px-4 py-3 text-center whitespace-nowrap"
                                >
                                    {col.render
                                        ? col.render(row, rowIndex)
                                        : row[col.key]}
                                </td>
                            ))}

                            {hasActions && (
                                <td
                                    className="px-4 py-3 sticky right-0 bg-white z-10 shadow-[-2px_0_6px_-2px_rgba(0,0,0,0.08)]"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {actions.map((action, i) => {
                                            if (action.show && !action.show(row)) return null;
                                            const ActionComponent = action.Component;
                                            return (
                                                <ActionComponent
                                                    key={i}
                                                    row={row}
                                                />
                                            );
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
