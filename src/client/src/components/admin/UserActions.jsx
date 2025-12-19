import { Button } from "../index";
import icons from "../../assets/react-icons/icon";
import { path } from "../../constants/path";
import { useNavigate } from "react-router-dom";

const { FiEye, FiShield, FiTrash2, FaRegEdit } = icons;

const isDeleted = row => Boolean(row.deletedAt);

export const UserActions = {
    // ================= VIEW =================
    view: onView => ({
        Component: ({ row }) => (
            <Button
                text={<FiEye />}
                textSize="text-lg"
                width="w-10"
                height="h-8"
                outline="rounded-md"
                bgColor="bg-blue-500"
                hoverBg="hover:bg-blue-600"
                onClick={() => onView(row)}
            />
        )
    }),

    // ================= EDIT =================
    edit: {
        Component: ({ row }) => {
            const navigate = useNavigate();
            const disabled = isDeleted(row);

            return (
                <Button
                    text={<FaRegEdit />}
                    textSize="text-lg"
                    width="w-10"
                    height="h-8"
                    outline="rounded-md"
                    bgColor={disabled ? "bg-gray-300" : "bg-orange-500"}
                    hoverBg={disabled ? "" : "hover:bg-orange-600"}
                    className={disabled ? "cursor-not-allowed opacity-60" : ""}
                    onClick={() => {
                        if (!disabled) {
                            navigate(path.UPDATE.replace(":id", row.id));
                        }
                    }}
                />
            );
        }
    },

    // ================= EDIT ROLE =================
    editRole: {
        Component: ({ row }) => {
            const navigate = useNavigate();
            const disabled = isDeleted(row);

            return (
                <Button
                    text={<FiShield />}
                    textSize="text-lg"
                    width="w-10"
                    height="h-8"
                    outline="rounded-md"
                    bgColor={disabled ? "bg-gray-300" : "bg-indigo-500"}
                    hoverBg={disabled ? "" : "hover:bg-indigo-600"}
                    className={disabled ? "cursor-not-allowed opacity-60" : ""}
                    onClick={() => {
                        if (!disabled) {
                            navigate(path.UPDATE.replace(":id", row.id));
                        }
                    }}
                />
            );
        }
    },

    // ================= SOFT DELETE =================
    softDelete: onDelete => ({
        Component: ({ row }) => {
            const disabled = isDeleted(row);

            return (
                <Button
                    text={<FiTrash2 />}
                    textSize="text-lg"
                    width="w-10"
                    height="h-8"
                    outline="rounded-md"
                    bgColor={disabled ? "bg-gray-300" : "bg-red-500"}
                    hoverBg={disabled ? "" : "hover:bg-red-600"}
                    className={disabled ? "cursor-not-allowed opacity-60" : ""}
                    onClick={() => {
                        if (!disabled) onDelete(row);
                    }}
                />
            );
        }
    })
};
