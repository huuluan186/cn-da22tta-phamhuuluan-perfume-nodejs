import { Button } from "../index";
import icons from "../../assets/react-icons/icon";
import { path } from "../../constants/path";
import { useNavigate } from "react-router-dom";

const { FiEye, FiShield, FiTrash2, FaRegEdit } = icons;

export const UserActions = {
    view: onView => ({
        Component: ({ row }) => {
            return (
                <Button
                    text={<FiEye/>}
                    textSize="text-lg" 
                    width='w-10'
                    height="h-8"
                    outline={'rounded-md'}
                    bgColor="bg-blue-500"
                    hoverBg="hover:bg-blue-600"
                    onClick={() => onView(row)}
                />
            );
        }
    }),

    edit: {
        Component: ({ row }) => {
            const navigate = useNavigate();
            return (
                <Button
                    text={<FaRegEdit/>}
                    textSize="text-lg" 
                    width='w-10'
                    height="h-8"
                    outline={'rounded-md'}
                    bgColor="bg-orange-500"
                    hoverBg="hover:bg-orange-600"
                    onClick={() =>
                        navigate(
                            path.UPDATE.replace(":id", row.id)
                        )
                    }
                />
            );
        }
    },

    editRole: {
        Component: ({ row }) => {
            const navigate = useNavigate();
            return (
                <Button
                    text={<FiShield/>}
                    textSize="text-lg" 
                    width='w-10'
                    height="h-8"
                    outline={'rounded-md'}
                    bgColor="bg-orange-500"
                    hoverBg="hover:bg-orange-600"
                    onClick={() =>
                        navigate(
                            path.UPDATE.replace(":id", row.id)
                        )
                    }
                />
            );
        }
    },

    softDelete: {
        Component: ({ row }) => (
            <Button
                text={<FiTrash2/>}
                textSize="text-lg" 
                width='w-10'
                height="h-8"
                outline={'rounded-md'}
                bgColor="bg-red-500"
                hoverBg="hover:bg-red-600"
                onClick={() => console.log("Soft delete user", row.id)}
            />
        ),
        show: row => !row.isDelete
    }
};
