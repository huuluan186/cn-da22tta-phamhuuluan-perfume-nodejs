import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, SelectField } from "../../../components/index";
import { apiUpdateUserRoles, apiGetAllRoles } from "../../../api/user";
import { getAllUsers } from "../../../store/actions/user";
import { toast } from "react-toastify";

const UserEditRole = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { users } = useSelector(state => state.user);

    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({ roleId: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Tìm user theo id từ danh sách users trong store
    const currentUser = users?.data?.find(user => user.id === id);

    // Set role hiện tại khi có dữ liệu user và roles
    useEffect(() => {
        if (currentUser && roles.length > 0) {
            if (currentUser.roles && currentUser.roles.length > 0) {
                const currentRoleId = currentUser.roles[0].id; // Lấy role đầu tiên
                setForm({ roleId: currentRoleId });
            } else {
                setForm({ roleId: "" });
            }
            setLoadingData(false);
        }
    }, [currentUser, roles]);

    // Nếu không tìm thấy user
    useEffect(() => {
        if (users && !currentUser && !loadingData) {
            toast.error("Không tìm thấy người dùng");
            navigate(-1);
        }
    }, [users, currentUser, navigate, loadingData]);

    // fetch roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await apiGetAllRoles();
                if (data?.err === 0) {
                    setRoles(data.response);
                }
            } catch (error) {
                console.error("Failed to load roles", error);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        if (!form.roleId) {
            setErrors({ roleId: "Vui lòng chọn vai trò" });
            return;
        }

        try {
            setLoading(true);

            const res = await apiUpdateUserRoles(id, {
                roleIds: [form.roleId],
            });

            if (res?.err === 0) {
                toast.success("Cập nhật quyền người dùng thành công");
                dispatch(getAllUsers());
                navigate(-1);
            } else {
                toast.error(res?.msg || "Cập nhật quyền thất bại");
            }
        } catch (error) {
            toast.error("Cập nhật quyền thất bại");
        } finally {
            setLoading(false);
        }
    };

    // Loading khi chưa có dữ liệu
    if (loadingData || roles.length === 0 || !currentUser) {
        return (
            <div className="bg-white p-4 rounded shadow text-center py-10">
                <p>Đang tải thông tin người dùng...</p>
            </div>
        );
    }

    return (
        <div className=" bg-white p-4 rounded shadow space-y-6">
            <h3 className="text-lg font-semibold">
                Cập nhật quyền cho user #{id}
            </h3>

            <div>
                <SelectField
                    label="Vai trò"
                    name="roleId"
                    value={form.roleId}
                    options={roles}          // dynamic
                    placeholder="-- Chọn vai trò --"
                    required
                    error={errors.roleId}
                    setError={setErrors}
                    onChange={handleChange}
                />
            </div>

            <div className="flex items-center justify-center gap-4">
                <Button
                    text="Hủy"
                    width='w-20'
                    outline='rounded-md'
                    bgColor="bg-gray-300"
                    textColor="text-black"
                    hoverBg="hover:bg-gray-400"
                    onClick={() => navigate(-1)}
                />

                <Button
                    text={loading ? "Đang lưu..." : "Lưu"}
                    width='w-20'
                    hoverBg="hover:bg-primary/80"
                    hoverText="hover:none"
                    outline='rounded-md'
                    onClick={handleSubmit}
                    className={loading ? "opacity-70 pointer-events-none" : ""}
                />
            </div>
        </div>
    );
};

export default UserEditRole;
