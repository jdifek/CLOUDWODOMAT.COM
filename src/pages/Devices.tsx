import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Device {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export function Devices() {
  const { t } = useLanguage();
  const [devices, setDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await api.get("/user/devices");
      setDevices(response.data);
    } catch {
      console.error("Failed to fetch devices");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/user/devices/${editingId}`, formData);
      } else {
        await api.post("/user/devices", formData);
      }
      await fetchDevices();
      handleCloseModal();
    } catch {
      console.error("Failed to save device");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("devices.deleteConfirm"))) return;

    try {
      await api.delete(`/user/devices/${id}`);
      await fetchDevices();
    } catch {
      console.error("Failed to delete device");
    }
  };

  const handleEdit = (device: Device) => {
    setEditingId(device.id);
    setFormData({ name: device.name, code: device.code });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", code: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("devices.title")}
        </h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("devices.addDevice")}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {devices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t("devices.noDevices")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    №
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("devices.deviceName")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("devices.deviceCode")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("devices.createdAt")}
                  </th>
                  {isAdmin && (

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("devices.actions")}
                  </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((device, idx) => (
                  <tr
                    key={device.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(device.createdAt).toLocaleString()}
                    </td>
                    {isAdmin && (

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(device)}
                        className="text-[#4A90E2] hover:text-[#3A7BC8] mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(device.id)}
                        className="text-[#D9534F] hover:text-[#C9302C]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? t("devices.editDevice") : t("devices.addDevice")}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("devices.deviceName")}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                  placeholder="My Device"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("devices.deviceCode")}
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                  placeholder="DEVICE-001"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? t("devices.saving") : t("devices.save")}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  {t("devices.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
