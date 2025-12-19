import { useParams, useNavigate } from "react-router-dom";

const UserEditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-md space-y-4">
      <h3 className="font-semibold">
        Cập nhật quyền cho user #{id}
      </h3>

      <select className="w-full border p-2 rounded">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        className="px-4 py-2 bg-primary text-white rounded"
        onClick={() => navigate(-1)}
      >
        Lưu
      </button>
    </div>
  );
};

export default UserEditRole;
