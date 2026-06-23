import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import { Plus, Edit2, Trash2, X, Save, WifiOff, Thermometer, MapPin, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Device {
  id: string;
  location: string;
  create_time: string;
  lastconnect: string;
  temp: string;
}

function getOfflineMinutes(lastconnect: string): number {
  const last = new Date(lastconnect).getTime();
  const now = Date.now();
  return (now - last) / 1000 / 60;
}

function getTempStatus(temp: string): "hot" | "cold" | "normal" {
  const t = parseFloat(temp);
  if (t >= 30) return "hot";
  if (t <= 5) return "cold";
  return "normal";
}

function TempBadge({ temp }: { temp: string }) {
  const status = getTempStatus(temp);
  const value = parseFloat(temp).toFixed(1);

  const styles = {
    hot: "bg-red-100 text-red-700 border border-red-300",
    cold: "bg-blue-100 text-blue-700 border border-blue-200",
    normal: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  const icons = {
    hot: "🔴",
    cold: "🔵",
    normal: "🟢",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      <Thermometer className="w-3 h-3" />
      {value}°C
      <span>{icons[status]}</span>
    </span>
  );
}

function OfflineBadge({ lastconnect }: { lastconnect: string }) {
  const minutes = getOfflineMinutes(lastconnect);
  const isStale = minutes > 15;

  const timeStr = (() => {
    if (minutes < 60) return `${Math.round(minutes)}м назад`;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return m > 0 ? `${h}ч ${m}м назад` : `${h}ч назад`;
  })();

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${
          isStale
            ? "bg-orange-100 text-orange-700 border border-orange-300"
            : "bg-gray-100 text-gray-500 border border-gray-200"
        }`}
      >
        {isStale && <WifiOff className="w-3 h-3" />}
        <Clock className="w-3 h-3" />
        {timeStr}
      </span>
      <span className="text-xs text-gray-400">{lastconnect}</span>
    </div>
  );
}

function getRowAlert(device: Device): "stale" | "hot" | "cold" | null {
  const offlineMinutes = getOfflineMinutes(device.lastconnect);
  const tempStatus = getTempStatus(device.temp);
  if (offlineMinutes > 15) return "stale";
  if (tempStatus === "hot") return "hot";
  if (tempStatus === "cold") return "cold";
  return null;
}

const rowAlertStyles: Record<string, string> = {
  stale: "bg-orange-50 border-l-4 border-l-orange-400",
  hot: "bg-red-50 border-l-4 border-l-red-400",
  cold: "bg-blue-50 border-l-4 border-l-blue-300",
};

export function Devices() {
  const { t } = useLanguage();
  const [devices, setDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ location: "", id: "" });
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await api.get("/user/devices");
      const raw = response.data;
      setDevices(Array.isArray(raw) ? raw : raw?.data ?? []);
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
    setFormData({ location: device.location, id: device.id });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ location: "", id: "" });
  };

  const alertCount = devices.filter((d) => getRowAlert(d) !== null).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("devices.title")}
          </h1>
          {alertCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-300">
              ⚠️ {alertCount} {alertCount === 1 ? "проблема" : "проблем"}
            </span>
          )}
        </div>
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

      {/* Legend */}
      {/* <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-orange-200 border border-orange-400 inline-block" />
          Офлайн &gt; 1 часа
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-200 border border-red-400 inline-block" />
          Высокая температура (≥30°C)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-200 border border-blue-300 inline-block" />
          Низкая температура (≤5°C)
        </span>
      </div> */}

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Локация</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("devices.createdAt") ?? "Создан"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Последнее подключение</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> Температура</span>
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {t("devices.actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((device, idx) => {
                  const alert = getRowAlert(device);
                  const rowClass = alert
                    ? rowAlertStyles[alert]
                    : idx % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50";

                  return (
                    <tr key={device.id} className={`${rowClass} transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600">{device.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{device.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{device.create_time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <OfflineBadge lastconnect={device.lastconnect} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <TempBadge temp={device.temp} />
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
                  );
                })}
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
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Локация
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                  placeholder="ул. Примерная 1, Город"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID устройства
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                  placeholder="860549070265330"
                  disabled={!!editingId}
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