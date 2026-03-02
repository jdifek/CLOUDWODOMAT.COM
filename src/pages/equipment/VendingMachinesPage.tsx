/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { SearchFilter, FilterField } from "../../components/SearchFilter";
import { DataTable } from "../../components/DataTable";
import { ActionButton } from "../../components/ActionButton";
import { StatusIndicator } from "../../components/StatusIndicator";

import { useLanguage } from "../../contexts/LanguageContext";
import { translateStatusCn } from "../../utils/deviceStatus";
import { formatDate } from "../../utils/formatDate";
import {
  Download,
  Signal,
  X,
  Thermometer,
  Droplets,
  Zap,
  ClipboardList,
  Receipt,
} from "lucide-react";
import { HappyTiService } from "../../services/happyTiService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeviceListItem {
  id: string;
  location: string;
  create_time: string;
  is_online?: string;
  is_onlie?: string;
}

interface DeviceExtra {
  support_dual_port: string;
  latitude: string;
  longitude: string;
  device_latitude: string;
  device_longitude: string;
}

interface DeviceDetail {
  id: string;
  saler: string;
  location: string;
  status_cn: string;
  pay_status: string;
  version: string | null;
  signal: string;
  temp: number;
  tds: string;
  lastconnect: string | null;
  limit: string;
  limit2: string;
  port_1_price: string;
  port_2_price: string;
  day_limit: string;
  flow_para: string;
  water_time: number;
  port2_waterlen: number;
  port2_water: number;
  extra: DeviceExtra | string;
}

interface CheckupRecord {
  water_meter: string;
  raw_water: string;
  sale_water: string;
  recovery_rate: string;
  ele_meter: string;
  use_ele: string;
  days: string;
  day_use_ele: string;
  operator: string;
  remark: string;
  create_time: string;
}

interface ConsumeRecord {
  key_id: string;
  card_num: string;
  shop_num: string;
  value: string;
  path: string;
  time: string;
  pay_id: string;
  location: string;
  after_value: string;
  cost_value: string;
  water1: string;
  water2: string;
}

interface AddValueRecord {
  key_id: string;
  card_num: string;
  alipay_number: string;
  operater: string;
  value: string;
  value_afterdiscount: string;
  card_aftervalue: string;
  status: string;
  device: string;
  location: string;
  type: string;
  is_openapi: number;
  time: string;
}

interface TableRow {
  id: number;
  deviceId: string;
  location: string;
  networkStatus: "online" | "offline";
  createdAt: string;
  raw: DeviceListItem;
}

interface Filters {
  location: string;
  deviceId: string;
  networkStatus: string;
}

type ModalTab = "details" | "inspections" | "consumes" | "recharges";
type DeviceType = "shop" | "shop_liquid" | "shop_happyfu" | "shop_water";

// ─── Props ────────────────────────────────────────────────────────────────────

interface VendingMachinesPageProps {
  deviceType: DeviceType;
  title: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function VendingMachinesPage({
  deviceType,
  title,
}: VendingMachinesPageProps) {
  const { t, language } = useLanguage();

  const [devices, setDevices] = useState<DeviceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    location: "",
    deviceId: "",
    networkStatus: "all",
  });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    location: "",
    deviceId: "",
    networkStatus: "all",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>("details");
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<DeviceDetail | null>(
    null
  );
  const [checkups, setCheckups] = useState<CheckupRecord[]>([]);
  const [checkupsLoading, setCheckupsLoading] = useState(false);
  const [consumes, setConsumes] = useState<ConsumeRecord[]>([]);
  const [consumesLoading, setConsumesLoading] = useState(false);
  const [recharges, setRecharges] = useState<AddValueRecord[]>([]);
  const [rechargesLoading, setRechargesLoading] = useState(false);

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  const fetchDevices = useCallback(
    async (pageNum: number, append = false) => {
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);

        const response = await HappyTiService.deviceList({
          type: deviceType,
          page: pageNum,
        });
        if (response.data.code === 0) {
          const list = response.data.data;
          setDevices((prev) => (append ? [...prev, ...list] : list));
          setHasMore(list.length === 20);
        }
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [deviceType]
  );

  useEffect(() => {
    setDevices([]);
    setPage(1);
    setHasMore(true);
    fetchDevices(1, false);
  }, [fetchDevices]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchDevices(next, true);
  };

  const openModal = async (device: DeviceListItem) => {
    setModalOpen(true);
    setActiveTab("details");
    setSelectedDetail(null);
    setCheckups([]);
    setConsumes([]);
    setRecharges([]);
    setDetailLoading(true);

    try {
      const res = await HappyTiService.deviceDetail({ deviceId: device.id });
      if (res.data.code === 0) {
        setSelectedDetail(res.data.data as any);
      }
    } catch (err) {
      console.error("Detail fetch failed:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const loadCheckups = async (deviceId: string) => {
    if (checkups.length > 0) return;
    setCheckupsLoading(true);
    try {
      const res = await HappyTiService.deviceCheckup({ deviceId, page: 1 });
      if (res.data.code === 0) setCheckups(res.data.data);
    } catch (err) {
      console.error("Checkup fetch failed:", err);
    } finally {
      setCheckupsLoading(false);
    }
  };

  const loadConsumes = async (deviceId: string) => {
    if (consumes.length > 0) return;
    setConsumesLoading(true);
    try {
      const res = await HappyTiService.recordList({ page: 1 });
      if (res.data.code === 0) {
        const filtered = res.data.data.filter(
          (r) => r.shop_num === deviceId || r.location.includes(deviceId)
        );
        setConsumes(
          filtered.length > 0 ? filtered : res.data.data.slice(0, 20)
        );
      }
    } catch (err) {
      console.error("Consumes fetch failed:", err);
    } finally {
      setConsumesLoading(false);
    }
  };

  const loadRecharges = async (deviceId: string) => {
    if (recharges.length > 0) return;
    setRechargesLoading(true);
    try {
      const res = await HappyTiService.addValueList({ page: 1 });
      if (res.data.code === 0) {
        const filtered = res.data.data.filter((r) => r.device === deviceId);
        setRecharges(
          filtered.length > 0 ? filtered : res.data.data.slice(0, 20)
        );
      }
    } catch (err) {
      console.error("Recharges fetch failed:", err);
    } finally {
      setRechargesLoading(false);
    }
  };

  const handleTabChange = (tab: ModalTab) => {
    setActiveTab(tab);
    if (!selectedDetail) return;
    if (tab === "inspections") loadCheckups(selectedDetail.id);
    if (tab === "consumes") loadConsumes(selectedDetail.id);
    if (tab === "recharges") loadRecharges(selectedDetail.id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDetail(null);
    setCheckups([]);
    setConsumes([]);
    setRecharges([]);
  };

  // ─── Filters ────────────────────────────────────────────────────────────────

  const handleSearch = () => setAppliedFilters({ ...filters });
  const handleClear = () => {
    const empty: Filters = { location: "", deviceId: "", networkStatus: "all" };
    setFilters(empty);
    setAppliedFilters(empty);
  };

  // ─── Table Data ─────────────────────────────────────────────────────────────

  const tableData: TableRow[] = devices
    .map((device, index) => {
      const isOnline =
        device.is_online === "online" || device.is_onlie === "online";
      return {
        id: index + 1,
        deviceId: device.id,
        location: device.location || "—",
        networkStatus: (isOnline ? "online" : "offline") as
          | "online"
          | "offline",
        createdAt: device.create_time,
        raw: device,
      };
    })
    .filter((row) => {
      if (
        appliedFilters.deviceId &&
        !row.deviceId
          .toLowerCase()
          .includes(appliedFilters.deviceId.toLowerCase())
      )
        return false;
      if (
        appliedFilters.location &&
        !row.location
          .toLowerCase()
          .includes(appliedFilters.location.toLowerCase())
      )
        return false;
      if (
        appliedFilters.networkStatus !== "all" &&
        row.networkStatus !== appliedFilters.networkStatus
      )
        return false;
      return true;
    });

  const columns = [
    { key: "id", label: "№" },
    { key: "deviceId", label: t("equipment.equipmentId") },
    { key: "location", label: t("equipment.territory") },
    {
      key: "networkStatus",
      label: t("equipment.networkStatus"),
      render: (value: "online" | "offline") => (
        <StatusIndicator status={value} label={t(`common.${value}`)} />
      ),
    },
    {
      key: "createdAt",
      label: t("common.createdAt"),
      render: (value: string) => formatDate(value, language),
    },
    {
      key: "operations",
      label: t("common.operations"),
      render: (_: any, row: TableRow) => (
        <ActionButton
          size="sm"
          variant="primary"
          onClick={() => openModal(row.raw)}
        >
          {t("common.details")}
        </ActionButton>
      ),
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────

  const extra =
    selectedDetail?.extra && typeof selectedDetail.extra !== "string"
      ? (selectedDetail.extra as DeviceExtra)
      : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      <SearchFilter onSearch={handleSearch} onClear={handleClear}>
        <FilterField
          label={t("equipment.territory")}
          value={filters.location}
          onChange={(value) => setFilters({ ...filters, location: value })}
        />
        <FilterField
          label={t("equipment.equipmentId")}
          value={filters.deviceId}
          onChange={(value) => setFilters({ ...filters, deviceId: value })}
        />
        <FilterField
          label={t("equipment.networkStatus")}
          type="select"
          value={filters.networkStatus}
          onChange={(value) => setFilters({ ...filters, networkStatus: value })}
          options={[
            { value: "all", label: t("common.all") },
            { value: "online", label: t("common.online") },
            { value: "offline", label: t("common.offline") },
          ]}
        />
      </SearchFilter>

      <div className="flex gap-2">
        <ActionButton variant="success">
          <Download className="w-4 h-4 mr-2 inline" />
          {t("common.export")}
        </ActionButton>
      </div>

      {loading ? (
       <div className="flex justify-center items-center p-12">
       <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
     </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={tableData}
            currentPage={1}
            totalPages={1}
            totalRecords={tableData.length}
          />
          {hasMore && (
            <div className="flex justify-center pt-2">
            <ActionButton
  variant="secondary"
  onClick={handleLoadMore}
  disabled={loadingMore}
>
  {loadingMore ? (
    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
  ) : (
    t("vendingMachines.loadMore")
  )}
</ActionButton>
            </div>
          )}
        </>
      )}

      {/* ─── Detail Modal ──────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col overflow-hidden"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("common.details")}
                  {selectedDetail && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {selectedDetail.id}
                    </span>
                  )}
                </h2>
                {selectedDetail && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedDetail.location}
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 shrink-0 overflow-x-auto">
              <TabBtn
                active={activeTab === "details"}
                onClick={() => handleTabChange("details")}
                icon={<Signal className="w-4 h-4" />}
                label={t("vendingMachines.details")}
              />
              <TabBtn
                active={activeTab === "inspections"}
                onClick={() => handleTabChange("inspections")}
                icon={<ClipboardList className="w-4 h-4" />}
                label={t("vendingMachines.inspections")}
              />
              <TabBtn
                active={activeTab === "consumes"}
                onClick={() => handleTabChange("consumes")}
                icon={<Droplets className="w-4 h-4" />}
                label={t("vendingMachines.consumption")}
              />
              <TabBtn
                active={activeTab === "recharges"}
                onClick={() => handleTabChange("recharges")}
                icon={<Receipt className="w-4 h-4" />}
                label={t("vendingMachines.recharges")}
              />
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {detailLoading ? (
                <Loader />
              ) : !selectedDetail ? (
                <div className="flex justify-center items-center py-12 text-red-500">
                  Не удалось загрузить данные устройства
                </div>
              ) : activeTab === "details" ? (
                <div className="space-y-6">
                  <Section
                    title={t("vendingMachines.statusSection")}
                    icon={<Signal className="w-4 h-4 text-blue-500" />}
                  >
                    <DetailRow
                      label={t("common.status")}
                      value={translateStatusCn(
                        selectedDetail.status_cn,
                        language
                      )}
                    />

                    <DetailRow
                      label={t("vendingMachines.paymentStatus")}
                      value={selectedDetail.pay_status}
                    />
                    <DetailRow
                      label={t("equipment.versionNumber")}
                      value={selectedDetail.version ?? "—"}
                    />
                    <DetailRow
                      label={t("vendingMachines.seller")}
                      value={selectedDetail.saler}
                    />
                    <DetailRow
                      label={t("equipment.lastConnection")}
                      value={formatDate(selectedDetail.lastconnect, language)}

                    />
                  </Section>

                  <Section
                    title={t("vendingMachines.sensors")}
                    icon={<Thermometer className="w-4 h-4 text-orange-500" />}
                  >
                    <DetailRow
                      label={t("equipment.temperature")}
                      value={
                        selectedDetail.temp != null ? (
                          <span className="flex items-center gap-1">
                            <Thermometer className="w-4 h-4 text-blue-500" />
                            {selectedDetail.temp}°C
                          </span>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailRow
                      label={t("equipment.signalStrength")}
                      value={
                        selectedDetail.signal ? (
                          <span className="flex items-center gap-1">
                            <Signal className="w-4 h-4 text-green-500" />
                            {selectedDetail.signal}
                          </span>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <DetailRow
                      label={t("vendingMachines.tds")}
                      value={selectedDetail.tds || "—"}
                    />
                  </Section>

                  <Section
                    title={t("vendingMachines.pricesAndLimits")}
                    icon={<Droplets className="w-4 h-4 text-cyan-500" />}
                  >
                    <DetailRow
                      label={t("vendingMachines.port1Price")}
                      value={
                        selectedDetail.port_1_price
                          ? `${selectedDetail.port_1_price} zł`
                          : "—"
                      }
                    />
                    <DetailRow
                      label={t("vendingMachines.port2Price")}
                      value={
                        selectedDetail.port_2_price
                          ? `${selectedDetail.port_2_price} zł`
                          : "—"
                      }
                    />
                    <DetailRow
                      label={t("vendingMachines.txLimitPort1")}
                      value={
                        selectedDetail.limit
                          ? `${selectedDetail.limit} zł`
                          : "—"
                      }
                    />
                    <DetailRow
                      label={t("vendingMachines.txLimitPort2")}
                      value={
                        selectedDetail.limit2
                          ? `${selectedDetail.limit2} zł`
                          : "—"
                      }
                    />
                    <DetailRow
                      label={t("vendingMachines.dayLimit")}
                      value={
                        selectedDetail.day_limit
                          ? `${selectedDetail.day_limit} zł`
                          : "—"
                      }
                    />
                  </Section>

                  <Section
                    title={t("vendingMachines.flowParams")}
                    icon={<Zap className="w-4 h-4 text-yellow-500" />}
                  >
                    <DetailRow
                      label={t("vendingMachines.flowMeter")}
                      value={selectedDetail.flow_para || "—"}
                    />
                    <DetailRow
                      label={t("vendingMachines.waterTimePort1")}
                      value={
                        selectedDetail.water_time != null
                          ? `${selectedDetail.water_time}`
                          : "—"
                      }
                    />
                    <DetailRow
                      label={t("vendingMachines.waterTimeLiterPort2")}
                      value={
                        selectedDetail.port2_waterlen != null
                          ? `${selectedDetail.port2_waterlen}`
                          : "—"
                      }
                    />
                    <DetailRow
                      label={t("vendingMachines.waterTimeControlPort2")}
                      value={
                        selectedDetail.port2_water != null
                          ? `${selectedDetail.port2_water}`
                          : "—"
                      }
                    />
                  </Section>

                  {extra && (extra.latitude || extra.longitude) && (
                    <Section
                      title={t("vendingMachines.geolocation")}
                      icon={<Signal className="w-4 h-4 text-purple-500" />}
                    >
                      <DetailRow
                        label={t("vendingMachines.latGcj02")}
                        value={extra.latitude || "—"}
                      />
                      <DetailRow
                        label={t("vendingMachines.lngGcj02")}
                        value={extra.longitude || "—"}
                      />
                      <DetailRow
                        label={t("vendingMachines.latDevice")}
                        value={extra.device_latitude || "—"}
                      />
                      <DetailRow
                        label={t("vendingMachines.lngDevice")}
                        value={extra.device_longitude || "—"}
                      />
                      <DetailRow
                        label={t("vendingMachines.dualPort")}
                        value={
                          extra.support_dual_port === "1"
                            ? t("vendingMachines.yes")
                            : t("vendingMachines.no")
                        }
                      />
                    </Section>
                  )}
                </div>
              ) : activeTab === "inspections" ? (
                <div>
                  {checkupsLoading ? (
                    <Loader />
                  ) : checkups.length === 0 ? (
                    <Empty text={t("vendingMachines.noInspections")} />
                  ) : (
                    <div className="space-y-4">
                      {checkups.map((rec, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700">
                              {t("vendingMachines.inspectionNo")}
                              {checkups.length - idx}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(rec.create_time, language)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <MiniRow
                              label={t("vendingMachines.waterMeter")}
                              value={rec.water_meter}
                            />
                            <MiniRow
                              label={t("vendingMachines.rawWater")}
                              value={rec.raw_water}
                            />
                            <MiniRow
                              label={t("vendingMachines.purifiedWater")}
                              value={rec.sale_water}
                            />
                            <MiniRow
                              label={t("vendingMachines.recoveryRate")}
                              value={rec.recovery_rate}
                            />
                            <MiniRow
                              label={t("vendingMachines.eleMeter")}
                              value={rec.ele_meter}
                            />
                            <MiniRow
                              label={t("vendingMachines.eleUsed")}
                              value={rec.use_ele}
                            />
                            <MiniRow
                              label={t("vendingMachines.intervalDays")}
                              value={rec.days}
                            />
                            <MiniRow
                              label={t("vendingMachines.dayEleUsed")}
                              value={rec.day_use_ele}
                            />
                            {rec.operator && (
                              <MiniRow
                                label={t("vendingMachines.inspector")}
                                value={rec.operator}
                              />
                            )}
                            {rec.remark && (
                              <MiniRow
                                label={t("vendingMachines.note")}
                                value={rec.remark}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : activeTab === "consumes" ? (
                <div>
                  {consumesLoading ? (
                    <Loader />
                  ) : consumes.length === 0 ? (
                    <Empty text={t("vendingMachines.noConsumption")} />
                  ) : (
                    <div className="space-y-3">
                      {consumes.map((rec, idx) => {
                        const isTerminal = rec.pay_id?.endsWith("_pos");
                        const isCoin = rec.card_num === "coin";
                        const paymentType = isTerminal
                          ? t("vendingMachines.terminal")
                          : isCoin
                          ? t("vendingMachines.cash")
                          : rec.card_num || "—";

                        return (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">
                                #{rec.key_id}
                              </span>
                              <span className="text-xs text-gray-400">
                              {formatDate(rec.time, language)}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                              <MiniRow
                                label={t("vendingMachines.paymentType")}
                                value={paymentType}
                              />
                              <MiniRow
                                label={t("vendingMachines.paymentId")}
                                value={rec.pay_id?.replace("_pos", "") || "—"}
                              />
                              <MiniRow
                                label={t("vendingMachines.amount")}
                                value={rec.value ? `${rec.value} zł` : "—"}
                              />
                              <MiniRow
                                label={t("vendingMachines.charged")}
                                value={
                                  rec.cost_value ? `${rec.cost_value} zł` : "—"
                                }
                              />
                              <MiniRow
                                label={t("vendingMachines.balanceAfter")}
                                value={
                                  rec.after_value
                                    ? `${rec.after_value} zł`
                                    : "—"
                                }
                              />
                              <MiniRow
                                label={t("vendingMachines.method")}
                                value={rec.path || "—"}
                              />
                              <MiniRow
                                label={t("vendingMachines.waterPort1")}
                                value={rec.water1 || "—"}
                              />
                              <MiniRow
                                label={t("vendingMachines.waterPort2")}
                                value={rec.water2 || "—"}
                              />
                              <MiniRow
                                label={t("vendingMachines.address")}
                                value={rec.location || "—"}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {rechargesLoading ? (
                    <Loader />
                  ) : recharges.length === 0 ? (
                    <Empty text={t("vendingMachines.noRecharges")} />
                  ) : (
                    <div className="space-y-3">
                      {recharges.map((rec, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              #{rec.key_id}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  rec.status === "success" ||
                                  rec.status === "finished"
                                    ? "bg-green-100 text-green-700"
                                    : rec.status === "refund" ||
                                      rec.status === "refunding"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : rec.status === "failed" ||
                                      rec.status === "cancel"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {rec.status}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDate(rec.time, language)}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <MiniRow
                              label={t("vendingMachines.cardNumber")}
                              value={rec.card_num || "—"}
                            />
                            <MiniRow
                              label={t("vendingMachines.operator")}
                              value={rec.operater || "—"}
                            />
                            <MiniRow
                              label={t("vendingMachines.amount")}
                              value={rec.value ? `${rec.value} zł` : "—"}
                            />
                            <MiniRow
                              label={t("vendingMachines.credited")}
                              value={
                                rec.value_afterdiscount
                                  ? `${rec.value_afterdiscount} zł`
                                  : "—"
                              }
                            />
                            <MiniRow
                              label={t("vendingMachines.balanceAfter")}
                              value={
                                rec.card_aftervalue
                                  ? `${rec.card_aftervalue} zł`
                                  : "—"
                              }
                            />
                            <MiniRow
                              label={t("vendingMachines.type")}
                              value={rec.type || "—"}
                            />
                            <MiniRow
                              label={t("vendingMachines.viaOpenApi")}
                              value={
                                rec.is_openapi === 1
                                  ? t("vendingMachines.yes")
                                  : t("vendingMachines.no")
                              }
                            />
                            <MiniRow
                              label={t("vendingMachines.paymentNumber")}
                              value={rec.alipay_number || "—"}
                            />
                            <MiniRow
                              label={t("vendingMachines.address")}
                              value={rec.location || "—"}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end shrink-0">
              <ActionButton variant="secondary" onClick={closeModal}>
                {t("common.cancel")}
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex justify-center items-center py-12 text-gray-400">
      {text}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active
          ? "border-[#4A90E2] text-[#4A90E2]"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="bg-gray-50 rounded-lg px-4 py-1 divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right ml-4">
        {value ?? "—"}
      </span>
    </div>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-medium text-gray-800">{value || "—"}</span>
    </div>
  );
}
