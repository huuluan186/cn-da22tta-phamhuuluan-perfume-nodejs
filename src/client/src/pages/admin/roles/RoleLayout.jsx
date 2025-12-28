import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../../components";
import { path } from "../../../constants/path";
import icons from '../../../assets/react-icons/icon'

const { IoAddCircleSharp  } = icons;

const RoleLayout = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const isList =
        pathname === `${path.ADMIN}/${path.ROLE_MANAGER}`;

    return (
        <div className="bg-white rounded-lg shadow p-5">
            <div className="mb-4">
                {/* Title - center */}
                <h2 className="text-2xl font-bold text-primary text-center mb-3">
                    QUẢN LÝ QUYỀN
                </h2>

                {/* Action - right */}
                {isList && (
                    <div className="flex justify-end">
                        <Button
                            text="Thêm quyền"
                            bgColor="bg-primary"
                            hoverBg="hover:bg-white"
                            outline="rounded-md border border-primary"
                            IcBefore={IoAddCircleSharp}
                            onClick={() =>
                                navigate(path.ADD)
                            }
                        />
                    </div>
                )}
            </div>

            <Outlet />
        </div>
    );
};

export default RoleLayout;
