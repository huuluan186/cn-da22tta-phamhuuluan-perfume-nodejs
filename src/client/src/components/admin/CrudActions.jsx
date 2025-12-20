import { useNavigate } from "react-router-dom";
import { Button } from "../index";
import icons from "../../assets/react-icons/icon";

const { FiEye, FiShield, FiTrash2, FaRegEdit } = icons;

const isDeleted = row => Boolean(row?.deletedAt);

/**
 * Base action creator
 */
const createAction = ({
    icon,
    bgColor,
    hoverBg,
    onClick,
    disabledCheck = isDeleted,
}) => ({
    Component: ({ row }) => {
        const disabled = disabledCheck(row);

        return (
            <Button
                text={icon}
                textSize="text-lg"
                width="w-10"
                height="h-8"
                outline="rounded-md"
                bgColor={disabled ? "bg-gray-300" : bgColor}
                hoverBg={disabled ? "" : hoverBg}
                className={disabled ? "cursor-not-allowed opacity-60" : ""}
                onClick={() => {
                    if (!disabled) onClick(row);
                }}
            />
        );
    }
});

/**
 * CRUD ACTIONS
 */
export const CrudActions = {
    view: (onView) =>
        createAction({
            icon: <FiEye />,
            bgColor: "bg-blue-500",
            hoverBg: "hover:bg-blue-600",
            onClick: onView,
            disabledCheck: () => false,
        }),

    edit: (pathTemplate) => ({
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
                            navigate(pathTemplate.replace(":id", row.id));
                        }
                    }}
                />
            );
        }
    }),

    editRole: (pathTemplate) => ({
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
                            navigate(pathTemplate.replace(":id", row.id));
                        }
                    }}
                />
            );
        }
    }),

    softDelete: (onDelete, options = {}) =>
        createAction({
            icon: <FiTrash2 />,
            bgColor: "bg-red-500",
            hoverBg: "hover:bg-red-600",
            onClick: onDelete,
            disabledCheck: options.disabledCheck || isDeleted,
        }),
};
