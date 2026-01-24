/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { Eye, Trash2, UserCog } from "lucide-react";

interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  role: string;
  createdAt: string;
  subscription?: any;
  _count?: { devices: number };
}

export function UsersList() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    phone: "",
    company: "",
    role: "USER",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch {
      console.error("Failed to fetch users");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", formData);
      setShowCreateModal(false);
      setFormData({
        email: "",
        password: "",
        name: "",
        surname: "",
        phone: "",
        company: "",
        role: "USER",
      });
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to create user");
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`${t("admin.deleteUserConfirm")}: ${userEmail}?`)) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch {
      console.error("Failed to delete user");
    }
  };

  const handleImpersonate = async (userId: string) => {
    if (!confirm(t("admin.loginAsUserConfirm"))) return;

    try {
      const response = await api.post(`/admin/users/${userId}/impersonate`);
      
      // Сохраняем текущий токен админа
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        localStorage.setItem('adminToken', currentToken);
      }
      
      // Устанавливаем токен impersonation
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("impersonating", "true");
      
      // Перенаправляем на главную
      window.location.href = "/";
    } catch {
      console.error("Failed to impersonate user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("admin.usersManagement")}
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8]"
        >
          + {t("admin.createUser")}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  №
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("admin.email")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("admin.name")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("admin.role")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("admin.devices")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("admin.subscription")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("admin.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name} {user.surname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user._count?.devices || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.subscription ? (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.subscription.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.subscription.status}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        {t("admin.noSubscription")}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        title={t("admin.viewDetails")}
                        className="p-2 rounded-md text-[#4A90E2] hover:bg-blue-50 hover:text-[#3A7BC8] transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleImpersonate(user.id)}
                        title={t("admin.loginAsUser")}
                        className="p-2 rounded-md text-[#F0AD4E] hover:bg-yellow-50 hover:text-[#EC971F] transition-colors"
                      >
                        <UserCog className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        title={t("admin.deleteUser")}
                        className="p-2 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{t("admin.createUser")}</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="email"
                placeholder={t("admin.email")}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder={t("admin.password")}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder={t("admin.name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder={t("admin.surname")}
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8]"
                >
                  {t("admin.create")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {t("admin.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}