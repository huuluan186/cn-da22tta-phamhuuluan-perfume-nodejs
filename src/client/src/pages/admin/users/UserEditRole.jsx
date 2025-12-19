import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, SelectField } from "../../../components/index";
import { apiUpdateUserRoles, apiGetAllRoles, apiDeleteUser  } from "../../../api/user";
import { getAllUsers } from "../../../store/actions/user";
import { toast } from "react-toastify";

const UserEditRole = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({ roleId: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // fetch roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await apiGetAllRoles();
                if (data?.err === 0) {
                setRoles(data.roles);
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

            await apiUpdateUserRoles(id, {
                roleIds: [form.roleId],
            });

            dispatch(getAllUsers()); // refresh list
            navigate(-1);
        } catch (error) {
            console.error(error);
            alert("Cập nhật quyền thất bại");
        } finally {
            setLoading(false);
        }
    };

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
