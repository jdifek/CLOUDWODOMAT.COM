/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  CreditCard,
  Search,
  RefreshCw,
  Lock,
  Unlock,
  Plus,
  X,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Link2,
  Send,
  AlertCircle,
  CheckSquare,
  Square,
  Eye,
  Phone,
  User,
  StickyNote,
  Save,
  Pencil,
} from "lucide-react";
import { HappyTiService } from "../services/happyTiService";
import { credentialsService } from "../services/credentialsService";
import { api } from "../services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardRecord {
  index: string;
  number: string;
  value: string;
  cash: string;
  status: string;
  owner: string;
  owner_name: string;
  create_time: string;
  shopname: string | null;
  last_day: string;
  name: string;
}

interface DeviceItem {
  id: string;
  location: string;
  is_online?: string;
  is_onlie?: string;
}

interface CardAssignment {
  cardNumber: string;
  deviceId: string;
  deviceName: string;
}

// ─── NEW: Card note type ──────────────────────────────────────────────────────
interface CardNote {
  phone: string;
  name: string;
  notes: string;
}

type CardNotesMap = Record<string, CardNote>;

type ModalType =
  | { type: "recharge"; card: CardRecord }
  | { type: "open" }
  | { type: "notify"; card: CardRecord }
  | { type: "limit"; cards: CardRecord[] }
  | { type: "detail"; card: CardRecord };

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ISCardsPage() {
  const { t } = useLanguage();

  const [cards, setCards] = useState<CardRecord[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsPage, setCardsPage] = useState(1);
  const [cardsHasMore, setCardsHasMore] = useState(false);

  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [devicesLoaded, setDevicesLoaded] = useState(false);

  const [assignments, setAssignments] = useState<Record<string, CardAssignment[]>>({});

  // ─── NEW: Card notes state ────────────────────────────────────────────────
  const [cardNotes, setCardNotes] = useState<CardNotesMap>({});

  const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
    normal: {
      label: t("isCards.active"),
      dot: "bg-emerald-400",
      badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    lost: {
      label: t("isCards.lost"),
      dot: "bg-amber-400",
      badge: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    cancel: {
      label: t("isCards.cancelled"),
      dot: "bg-red-400",
      badge: "bg-red-50 text-red-600 border border-red-200",
    },
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalType | null>(null);
  const closeModal = () => setModal(null);

  // ─── Load cards ─────────────────────────────────────────────────────────────
  const loadCards = useCallback(async (page = 1, append = false) => {
    if (!append) setCardsLoading(true);
    try {
      const res = await HappyTiService.cardList({ page });
      if (res.data.code === 0) {
        const batch: CardRecord[] = res.data.data ?? [];
        setCards((prev) => {
          const next = append ? [...prev, ...batch] : batch;
          // After loading, sync notes for the new card numbers
          syncNotes(next.map((c) => c.number));
          return next;
        });
        setCardsPage(page);
        setCardsHasMore(batch.length === 20);
      }
    } finally {
      setCardsLoading(false);
    }
  }, []);

  // ─── NEW: Sync notes from our backend ────────────────────────────────────
  const syncNotes = useCallback(async (cardNumbers: string[]) => {
    if (cardNumbers.length === 0) return;
    try {
      const { data } = await api.post("/card-notes/sync", { cardNumbers });
      setCardNotes((prev) => ({ ...prev, ...(data.notes ?? {}) }));
    } catch {
      /* silent */
    }
  }, []);

  // ─── NEW: Save a single card note ────────────────────────────────────────
  const saveNote = useCallback(
    async (cardNumber: string, note: Partial<CardNote>) => {
      try {
        const current = cardNotes[cardNumber] ?? { phone: "", name: "", notes: "" };
        const merged = { ...current, ...note };
        await api.put(`/card-notes/${encodeURIComponent(cardNumber)}`, merged);
        setCardNotes((prev) => ({ ...prev, [cardNumber]: merged }));
        return true;
      } catch {
        /* silent */
      }
      return false;
    },
    [cardNotes]
  );

  // ─── Load devices ────────────────────────────────────────────────────────────
  const loadDevices = useCallback(async () => {
    if (devicesLoaded) return;
    setDevicesLoading(true);
    try {
      const res = await HappyTiService.deviceList({ type: "shop", page: 1 });
      if (res.data.code === 0) {
        setDevices(res.data.data ?? []);
        setDevicesLoaded(true);
      }
    } finally {
      setDevicesLoading(false);
    }
  }, [devicesLoaded]);

  // ─── Load assignments from our backend ──────────────────────────────────────
  const loadAssignments = useCallback(async () => {
    try {
      const { data } = await api.get("/card-notes");
      const map: Record<string, CardAssignment[]> = {};
      (data.assignments || []).forEach((a: CardAssignment) => {
        if (!map[a.cardNumber]) map[a.cardNumber] = [];
        map[a.cardNumber].push(a);
      });
      setAssignments(map);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    loadCards(1);
    loadAssignments();
  }, [loadCards, loadAssignments]);

  // ─── Filter & search ─────────────────────────────────────────────────────────
  const filtered = cards.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const note = cardNotes[c.number];
    return (
      c.number.toLowerCase().includes(q) ||
      (c.owner || "").includes(q) ||
      (c.owner_name || "").toLowerCase().includes(q) ||
      (c.shopname || "").includes(q) ||
      (note?.name || "").toLowerCase().includes(q) ||
      (note?.phone || "").includes(q) ||
      (note?.notes || "").toLowerCase().includes(q)
    );
  });

  // ─── Selection helpers ───────────────────────────────────────────────────────
  const toggleSelect = (num: string) => {
    const next = new Set(selected);
    next.has(num) ? next.delete(num) : next.add(num);
    setSelected(next);
  };
  const selectAll = () => setSelected(new Set(filtered.map((c) => c.number)));
  const clearSelection = () => setSelected(new Set());
  const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.number));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4A90E2] flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t("isCards.title")}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {cards.length} {t("isCards.cardsLoaded")}
                {selected.size > 0 && (
                  <span className="ml-2 text-[#4A90E2] font-medium">
                    · {selected.size} {t("isCards.selected")}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { loadCards(1); loadAssignments(); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              onClick={() => { setModal({ type: "open" }); loadDevices(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#4A90E2] text-white text-sm font-semibold rounded-lg hover:bg-[#3a7bc8] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Open Cards
            </button>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("isCards.search")}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {["all", "normal", "lost", "cancel"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  statusFilter === s
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {s === "all" ? "All" : STATUS_CONFIG[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk actions bar */}
        {selected.size > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">{selected.size} selected:</span>
            <button
              onClick={() => {
                const selectedCards = filtered.filter((c) => selected.has(c.number));
                setModal({ type: "limit", cards: selectedCards });
                loadDevices();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" />
              Assign to Device
            </button>
            <button
              onClick={clearSelection}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ── Cards list ── */}
      <div className="p-6">
        {cardsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#4A90E2] rounded-full animate-spin" />
            <p className="text-sm text-gray-400">{t("isCards.loading")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CreditCard className="w-12 h-12 text-gray-300" />
            <p className="text-gray-400">{t("isCards.noCards")}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <button
                onClick={allSelected ? clearSelection : selectAll}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {allSelected ? (
                  <CheckSquare className="w-4 h-4 text-[#4A90E2]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {allSelected ? "Deselect all" : "Select all"}
              </button>
              <span className="text-xs text-gray-400">
                {filtered.length} {t("isCards.cards")}
              </span>
            </div>

            <div className="space-y-2">
              {filtered.map((card) => (
                <CardRow
                  key={card.number}
                  card={card}
                  isSelected={selected.has(card.number)}
                  isExpanded={expandedCard === card.number}
                  assignments={assignments[card.number] || []}
                  note={cardNotes[card.number] ?? { phone: "", name: "", notes: "" }}
                  onToggleSelect={() => toggleSelect(card.number)}
                  onToggleExpand={() =>
                    setExpandedCard(expandedCard === card.number ? null : card.number)
                  }
                  onRecharge={() => setModal({ type: "recharge", card })}
                  onLoss={(action) => handleLossReport(card, action, loadCards)}
                  onNotify={() => { setModal({ type: "notify", card }); loadDevices(); }}
                  onLimit={() => { setModal({ type: "limit", cards: [card] }); loadDevices(); }}
                  onDetail={() => setModal({ type: "detail", card })}
                  onSaveNote={(note) => saveNote(card.number, note)}
                  devices={devices}
                  statusConfig={STATUS_CONFIG}
                />
              ))}
            </div>

            {cardsHasMore && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => loadCards(cardsPage + 1, true)}
                  className="px-6 py-2.5 text-sm text-[#4A90E2] border border-[#4A90E2] rounded-xl hover:bg-blue-50 transition-colors font-medium"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {modal?.type === "open" && (
        <OpenCardsModal
          devices={devices}
          devicesLoading={devicesLoading}
          onClose={closeModal}
          onSuccess={() => { closeModal(); loadCards(1); }}
        />
      )}
      {modal?.type === "recharge" && (
        <RechargeModal
          card={modal.card}
          onClose={closeModal}
          onSuccess={() => { closeModal(); loadCards(1); }}
        />
      )}
      {modal?.type === "notify" && (
        <NotifyModal
          card={modal.card}
          devices={devices}
          devicesLoading={devicesLoading}
          onClose={closeModal}
        />
      )}
      {modal?.type === "limit" && (
        <LimitModal
          cards={modal.cards}
          devices={devices}
          devicesLoading={devicesLoading}
          assignments={assignments}
          onClose={closeModal}
          onSuccess={(newAssignments) => {
            setAssignments((prev) => ({ ...prev, ...newAssignments }));
            closeModal();
          }}
        />
      )}
      {modal?.type === "detail" && (
        <CardDetailModal
          card={modal.card}
          assignments={assignments[modal.card.number] || []}
          note={cardNotes[modal.card.number] ?? { phone: "", name: "", notes: "" }}
          onClose={closeModal}
          onRecharge={() => setModal({ type: "recharge", card: modal.card })}
          onNotify={() => { setModal({ type: "notify", card: modal.card }); loadDevices(); }}
          onLimit={() => { setModal({ type: "limit", cards: [modal.card] }); loadDevices(); }}
          statusConfig={STATUS_CONFIG}
          onLoss={(action) => handleLossReport(modal.card, action, loadCards)}
          onSaveNote={(note) => saveNote(modal.card.number, note)}
        />
      )}
    </div>
  );
}

// ─── Loss report helper ───────────────────────────────────────────────────────

async function handleLossReport(
  card: CardRecord,
  action: "normal" | "lost",
  reload: () => void
) {
  try {
    await HappyTiService.cardLossReport({ card: card.number, action });
    reload();
  } catch (e) {
    console.error("Loss report failed:", e);
  }
}

// ─── NEW: Inline Card Note Editor ────────────────────────────────────────────

function CardNoteEditor({
  cardNumber,
  note,
  onSave,
}: {
  cardNumber: string;
  note: CardNote;
  onSave: (note: Partial<CardNote>) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CardNote>({ ...note });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedNote, setExpandedNote] = useState(false);

  // Keep form in sync if note changes externally
  useEffect(() => {
    if (!editing) setForm({ ...note });
  }, [note, editing]);

  const hasContent = note.phone || note.name || note.notes;

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(form);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleCancel = () => {
    setForm({ ...note });
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="mt-3">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <StickyNote className="w-3.5 h-3.5 text-violet-400" />
            Client info
          </p>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 transition-colors font-medium"
          >
            <Pencil className="w-3 h-3" />
            {hasContent ? "Edit" : "Add"}
          </button>
        </div>

        {hasContent ? (
          <div className="flex flex-wrap gap-2">
            {note.name && (
              <span className="flex items-center gap-1.5 text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1.5 rounded-lg font-medium">
                <User className="w-3 h-3 shrink-0" />
                {note.name}
              </span>
            )}
            {note.phone && (
              <span className="flex items-center gap-1.5 text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1.5 rounded-lg font-medium">
                <Phone className="w-3 h-3 shrink-0" />
                {note.phone}
              </span>
            )}
           {note.notes && (
 <span
 onClick={() => setExpandedNote(v => !v)}
 className="flex items-start gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors max-w-full min-w-0"
>
 <StickyNote className="w-3 h-3 shrink-0 mt-0.5" />
 <span className={`min-w-0 ${expandedNote ? "whitespace-normal break-words" : "truncate"}`}>
   {note.notes}
 </span>
    {!expandedNote && note.notes.length > 50 && (
      <ChevronDown className="w-3 h-3 shrink-0 mt-0.5 opacity-50" />
    )}
    {expandedNote && (
      <ChevronUp className="w-3 h-3 shrink-0 mt-0.5 opacity-50" />
    )}
  </span>
)}
            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            No client info yet — click Add to fill in name, phone, or notes
          </p>
        )}
      </div>
    );
  }

  // Editing state
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mb-2">
        <StickyNote className="w-3.5 h-3.5 text-violet-400" />
        Client info
      </p>
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 space-y-2.5">
        {/* Name */}
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Client name"
            className="flex-1 text-sm bg-white border border-violet-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-300"
          />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+7 999 000 00 00"
            className="flex-1 text-sm bg-white border border-sky-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-gray-300"
          />
        </div>

        {/* Notes */}
        <div className="flex items-start gap-2">
          <StickyNote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-1.5" />
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Notes (optional)"
            rows={2}
            className="flex-1 text-sm bg-white border border-amber-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-300 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors font-semibold"
          >
            {saving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card Row ─────────────────────────────────────────────────────────────────

function CardRow({
  card,
  isSelected,
  isExpanded,
  assignments,
  note,
  onToggleSelect,
  onToggleExpand,
  onRecharge,
  onLoss,
  onNotify,
  onLimit,
  onDetail,
  onSaveNote,
  devices,
  statusConfig,
}: {
  card: CardRecord;
  isSelected: boolean;
  isExpanded: boolean;
  assignments: CardAssignment[];
  note: CardNote;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onRecharge: () => void;
  onLoss: (action: "normal" | "lost") => void;
  onNotify: () => void;
  onLimit: () => void;
  onDetail: () => void;
  onSaveNote: (note: Partial<CardNote>) => Promise<boolean>;
  devices: DeviceItem[];
  statusConfig: Record<string, { label: string; dot: string; badge: string }>;
}) {
  const st = statusConfig[card.status] ?? {
    label: card.status,
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600",
  };
  const balance = parseFloat(card.value ?? "0");
  const cash = parseFloat(card.cash ?? "0");
  const { t } = useLanguage();
  const hasNote = note.phone || note.name || note.notes;

  return (
    <div
      className={`bg-white rounded-xl border transition-all ${
        isSelected
          ? "border-[#4A90E2] shadow-md shadow-blue-100"
          : "border-gray-200 hover:border-gray-300 shadow-sm"
      }`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onToggleSelect} className="shrink-0">
          {isSelected ? (
            <CheckSquare className="w-4 h-4 text-[#4A90E2]" />
          ) : (
            <Square className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <div className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />

        <span className="font-mono text-sm font-semibold text-gray-800 flex-1 min-w-0 truncate">
          {card.number}
        </span>

        {/* ─ Client name badge (NEW) ─ */}
        {note.name && (
          <span className="hidden sm:flex items-center gap-1 text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full font-medium max-w-28 truncate">
            <User className="w-3 h-3 shrink-0" />
            {note.name}
          </span>
        )}

        {(card.owner_name || card.owner) && !note.name && (
          <span className="text-xs text-gray-500 hidden sm:block truncate max-w-24">
            {card.owner_name || card.owner}
          </span>
        )}

        {assignments.length > 0 && (
          <span className="shrink-0 flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
            <Link2 className="w-3 h-3" />
            {assignments.length}
          </span>
        )}

        {/* ─ Phone quick-badge (NEW) ─ */}
        {note.phone && (
          <span className="hidden md:flex items-center gap-1 text-xs text-sky-600 font-mono">
            <Phone className="w-3 h-3" />
            {note.phone}
          </span>
        )}

        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold ${st.badge}`}>
          {st.label}
        </span>

        <div className="shrink-0 text-right hidden sm:block">
          <div className="text-sm font-bold text-gray-900">{balance.toFixed(2)}</div>
          <div className="text-xs text-gray-400">{cash.toFixed(2)} cash</div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <ActionBtn icon={<Eye className="w-3.5 h-3.5" />} onClick={onDetail} title={t("isCards.details")} color="gray" />
          <ActionBtn icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRecharge} title={t("isCards.recharge")} color="green" />
          <ActionBtn icon={<Send className="w-3.5 h-3.5" />} onClick={onNotify} title={t("isCards.remoteSwipe")} color="blue" />
          <ActionBtn icon={<Link2 className="w-3.5 h-3.5" />} onClick={onLimit} title={t("isCards.assignDevices")} color="purple" />
          {card.status === "normal" ? (
            <ActionBtn icon={<Lock className="w-3.5 h-3.5" />} onClick={() => onLoss("lost")} title={t("isCards.reportLost")} color="orange" />
          ) : (
            <ActionBtn icon={<Unlock className="w-3.5 h-3.5" />} onClick={() => onLoss("normal")} title={t("isCards.restore")} color="blue" />
          )}
          <button
            onClick={onToggleExpand}
            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 rounded-b-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <InfoCell label={t("isCards.balanceBonus")} value={balance.toFixed(2)} />
            <InfoCell label={t("isCards.balanceCash")} value={cash.toFixed(2)} />
            <InfoCell label={t("isCards.owner")} value={card.owner_name || card.owner || "—"} />
            <InfoCell label={t("isCards.created")} value={card.create_time || "—"} />
            {card.name && <InfoCell label={t("isCards.plan")} value={card.name} />}
            {card.last_day && <InfoCell label={t("isCards.expires")} value={card.last_day} />}
            {card.shopname && <InfoCell label={t("isCards.lastUsed")} value={card.shopname} />}
          </div>

          {/* Assignments */}
          {assignments.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-500" />
                Assigned to devices
              </p>
              <div className="flex flex-wrap gap-2">
                {assignments.map((a) => (
                  <div
                    key={a.deviceId}
                    className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-xs"
                  >
                    <span className="font-mono font-semibold text-blue-800">{a.deviceId}</span>
                    {a.deviceName && <span className="text-blue-600">{a.deviceName}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── NEW: Client notes editor ─── */}
          <div className="border-t border-gray-200 pt-3 mt-3">
            <CardNoteEditor
              cardNumber={card.number}
              note={note}
              onSave={onSaveNote}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Open Cards Modal ─────────────────────────────────────────────────────────

function OpenCardsModal({
  devices,
  devicesLoading,
  onClose,
  onSuccess,
}: {
  devices: DeviceItem[];
  devicesLoading: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({ number: "", totalNumber: "1", deviceId: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await HappyTiService.cardOpen({
        number: form.number,
        userid: credentialsService.get()?.saler ?? "",
        totalNumber: form.totalNumber ? Number(form.totalNumber) : undefined,
        deviceId: form.deviceId || undefined,
      });
      setResult(res.data);
      if (res.data?.code === 0) setTimeout(onSuccess, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Open Cards" onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={t("isCards.startNumber")} required>
          <input required type="text" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="10400040002" className={inputCls} />
        </Field>
        <Field label={t("isCards.count")}>
          <input type="number" min="1" max="200" value={form.totalNumber} onChange={(e) => setForm({ ...form, totalNumber: e.target.value })} className={inputCls} />
          <p className="text-xs text-gray-400 mt-1">{t("isCards.maxCards")}</p>
        </Field>
        <Field label={t("isCards.deviceOptional")}>
          <select value={form.deviceId} onChange={(e) => setForm({ ...form, deviceId: e.target.value })} className={inputCls}>
            <option value="">{t("isCards.noDevice")}</option>
            {devicesLoading ? <option disabled>Loading...</option> : devices.map((d) => <option key={d.id} value={d.id}>{d.id} — {d.location}</option>)}
          </select>
        </Field>
        {result && <ResultBanner success={result.code === 0} message={result.msg} data={result.data} />}
        <ModalFooter onClose={onClose} loading={loading} submitLabel="Open Cards" />
      </form>
    </Modal>
  );
}

// ─── Recharge Modal ───────────────────────────────────────────────────────────

function RechargeModal({ card, onClose, onSuccess }: { card: CardRecord; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ value: "", income: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await HappyTiService.cardRecharge({
        card: card.number,
        value: parseFloat(form.value),
        income: parseFloat(form.income),
        trad_id: `recharge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      });
      setResult(res.data);
      if (res.data?.error === "0" || res.data?.addvalue) setTimeout(onSuccess, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Recharge: ${card.number}`} onClose={onClose} maxWidth="max-w-sm">
      <div className="mb-4 flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
        <div>
          <p className="text-xs text-gray-500">{t("isCards.currentBalance")}</p>
          <p className="text-lg font-bold text-gray-900">{parseFloat(card.value ?? "0").toFixed(2)}</p>
        </div>
        <div className="border-l border-gray-200 pl-3">
          <p className="text-xs text-gray-500">Cash</p>
          <p className="text-sm font-semibold text-gray-700">{parseFloat(card.cash ?? "0").toFixed(2)}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={t("isCards.totalAmount")}>
          <input required type="number" min="0.01" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="10.00" className={inputCls} />
        </Field>
        <Field label={t("isCards.actualCash")}>
          <input required type="number" min="0.01" step="0.01" value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} placeholder="10.00" className={inputCls} />
        </Field>
        {result && <ResultBanner success={result.error === "0"} message={result.error === "0" ? `Charged ${result.addvalue}. New balance: ${result.value}` : result.error} />}
        <ModalFooter onClose={onClose} loading={loading} submitLabel="Recharge" />
      </form>
    </Modal>
  );
}

// ─── Notify Modal ─────────────────────────────────────────────────────────────

function NotifyModal({ card, devices, devicesLoading, onClose }: { card: CardRecord; devices: DeviceItem[]; devicesLoading: boolean; onClose: () => void }) {
  const [deviceId, setDeviceId] = useState(card.shopname || "");
  const [loading, setLoading] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [notified, setNotified] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const creds = credentialsService.get();
      const res = await HappyTiService.cardNotify({ card: card.number, device: deviceId, password: creds?.password ?? "" });
      setResult(res.data);
      if (res.data?.error === "0") setNotified(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setStopLoading(true);
    try {
      const res = await HappyTiService.cardStop({ deviceId: deviceId || card.shopname || "", number: card.number });
      setResult({ error: res.data?.status === "1" ? "0" : "1", data: res.data?.message });
      if (res.data?.status === "1") setNotified(false);
    } finally {
      setStopLoading(false);
    }
  };

  return (
    <Modal title="Remote Swipe (Notify Device)" onClose={onClose} maxWidth="max-w-md">
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <strong>{t("isCards.howItWorks")}:</strong> Sends the card balance to the device — equivalent to physically swiping the card.
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={t("isCards.card")}>
          <div className={`${inputCls} bg-gray-50 text-gray-600 font-mono`}>{card.number}</div>
        </Field>
        <Field label={t("isCards.device")} required>
          <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)} className={inputCls} required>
            <option value="">{t("isCards.selectDevice")}</option>
            {devicesLoading ? <option disabled>Loading...</option> : devices.map((d) => <option key={d.id} value={d.id}>{d.id} — {d.location}</option>)}
          </select>
          {card.shopname && <p className="text-xs text-gray-400 mt-1">Last used: {card.shopname}</p>}
        </Field>
        {notified && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <p className="text-sm text-amber-800 flex-1">Card active on device</p>
          </div>
        )}
        {result && <ResultBanner success={result.error === "0"} message={result.data || result.error} />}
        {(deviceId || card.shopname) && (
          <button type="button" onClick={handleStop} disabled={stopLoading} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl hover:bg-red-100 disabled:opacity-50 transition-colors">
            {stopLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            Stop dispensing
          </button>
        )}
        <ModalFooter onClose={onClose} loading={loading} submitLabel="Send to Device" />
      </form>
    </Modal>
  );
}

// ─── Limit Modal ──────────────────────────────────────────────────────────────

function LimitModal({ cards, devices, devicesLoading, assignments, onClose, onSuccess }: {
  cards: CardRecord[]; devices: DeviceItem[]; devicesLoading: boolean;
  assignments: Record<string, CardAssignment[]>; onClose: () => void;
  onSuccess: (newAssignments: Record<string, CardAssignment[]>) => void;
}) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [allDevices, setAllDevices] = useState(false);
  const [ports, setPorts] = useState({ port1: true, port2: true, port3: false, port4: false });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [deviceSearch, setDeviceSearch] = useState("");
  const { t } = useLanguage();
  const isSingleCard = cards.length === 1;

  useEffect(() => {
    if (isSingleCard) {
      const existing = assignments[cards[0].number] || [];
      setSelectedDevices(existing.map((a) => a.deviceId));
    }
  }, []);

  const toggleDevice = (id: string) => {
    setSelectedDevices((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
    setAllDevices(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetDevices = allDevices ? devices.map((d) => d.id) : selectedDevices;
    if (targetDevices.length === 0) return;
    setLoading(true);
    const allResults: any[] = [];
    const newAssignments: Record<string, CardAssignment[]> = {};
    try {
      for (const card of cards) {
        for (const deviceId of targetDevices) {
          try {
            const res = await HappyTiService.cardLimitCreate({ cardStart: card.number, cardEnd: card.number, deviceId, port1: ports.port1 ? "1" : "0", port2: ports.port2 ? "1" : "0", port3: ports.port3 ? "1" : "0", port4: ports.port4 ? "1" : "0" });
            allResults.push({ card: card.number, deviceId, result: res.data });
          } catch {
            allResults.push({ card: card.number, deviceId, result: { code: -1, msg: "Error" } });
          }
        }
        const deviceObjs = targetDevices.map((id) => ({ deviceId: id, deviceName: devices.find((d) => d.id === id)?.location || "" }));
        try {
          await api.put(`/card-notes/${encodeURIComponent(card.number)}/devices`, { devices: deviceObjs });
          newAssignments[card.number] = deviceObjs.map((d) => ({ cardNumber: card.number, deviceId: d.deviceId, deviceName: d.deviceName }));
        } catch { /* silent */ }
      }
      setResults(allResults);
      setTimeout(() => onSuccess(newAssignments), 2000);
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices.filter((d) => !deviceSearch || d.id.includes(deviceSearch) || d.location.toLowerCase().includes(deviceSearch.toLowerCase()));

  return (
    <Modal title={isSingleCard ? `Assign: ${cards[0].number}` : `Assign ${cards.length} cards`} onClose={onClose} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isSingleCard && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">Cards to assign:</p>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {cards.map((c) => <span key={c.number} className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">{c.number}</span>)}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-semibold text-gray-700">{t("isCards.allDevices")}</p>
            <p className="text-xs text-gray-500">Assign to all {devices.length} devices</p>
          </div>
          <button type="button" onClick={() => { setAllDevices((v) => !v); setSelectedDevices([]); }} className={`w-10 h-6 rounded-full transition-colors relative ${allDevices ? "bg-[#4A90E2]" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${allDevices ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
        </div>
        {!allDevices && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500">Or select specific devices:</p>
              {selectedDevices.length > 0 && <span className="text-xs text-[#4A90E2] font-medium">{selectedDevices.length} selected</span>}
            </div>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={deviceSearch} onChange={(e) => setDeviceSearch(e.target.value)} placeholder={t("isCards.searchDevices")} className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]" />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-1">
              {devicesLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-blue-400" /></div>
              ) : filteredDevices.length === 0 ? (
                <p className="text-center py-4 text-sm text-gray-400">No devices</p>
              ) : (
                filteredDevices.map((d) => {
                  const isOnline = d.is_online === "online" || d.is_onlie === "online";
                  const isSel = selectedDevices.includes(d.id);
                  return (
                    <button key={d.id} type="button" onClick={() => toggleDevice(d.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${isSel ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"}`}>
                      {isSel ? <CheckSquare className="w-4 h-4 text-[#4A90E2] shrink-0" /> : <Square className="w-4 h-4 text-gray-400 shrink-0" />}
                      <span className="font-mono text-xs text-gray-700 flex-1">{d.id}</span>
                      <span className="text-xs text-gray-500 truncate max-w-28">{d.location}</span>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? "bg-emerald-400" : "bg-gray-300"}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Allowed ports:</p>
          <div className="flex gap-3">
            {([1, 2, 3, 4] as const).map((n) => {
              const key = `port${n}` as keyof typeof ports;
              return (
                <label key={n} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={ports[key]} onChange={(e) => setPorts((p) => ({ ...p, [key]: e.target.checked }))} className="w-3.5 h-3.5 accent-[#4A90E2]" />
                  <span className="text-sm text-gray-700">Port {n}</span>
                </label>
              );
            })}
          </div>
        </div>
        {results.length > 0 && (
          <div className="max-h-32 overflow-y-auto space-y-1">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${r.result?.code === 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {r.result?.code === 0 ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
                <span className="font-mono">{r.card}</span>
                <span>→</span>
                <span className="font-mono">{r.deviceId}</span>
                <span className="text-gray-500">{r.result?.msg}</span>
              </div>
            ))}
          </div>
        )}
        <ModalFooter onClose={onClose} loading={loading} submitLabel="Apply Assignment" disabled={!allDevices && selectedDevices.length === 0} />
      </form>
    </Modal>
  );
}

// ─── Card Detail Modal ────────────────────────────────────────────────────────

function CardDetailModal({
  card, assignments, note, onClose, onRecharge, onNotify, onLimit, onLoss, onSaveNote, statusConfig,
}: {
  card: CardRecord; assignments: CardAssignment[]; note: CardNote; onClose: () => void;
  onRecharge: () => void; onNotify: () => void; onLimit: () => void;
  onLoss: (action: "normal" | "lost") => void;
  onSaveNote: (note: Partial<CardNote>) => Promise<boolean>;
  statusConfig: Record<string, { label: string; dot: string; badge: string }>;
}) {
  const st = statusConfig[card.status] ?? { label: card.status, dot: "bg-gray-400", badge: "bg-gray-100 text-gray-600" };
  const { t } = useLanguage();

  return (
    <Modal title="Card Details" onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className={`w-3 h-3 rounded-full ${st.dot}`} />
        <span className="font-mono text-lg font-bold text-gray-900">{card.number}</span>
        <span className={`ml-auto text-xs px-2 py-1 rounded-full font-semibold ${st.badge}`}>{st.label}</span>
      </div>

      {/* ─── NEW: Client info section in modal ─── */}
      <div className="mb-5 p-4 bg-violet-50 border border-violet-200 rounded-xl">
        <CardNoteEditor cardNumber={card.number} note={note} onSave={onSaveNote} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <InfoCell label={t("isCards.balanceBonus")} value={parseFloat(card.value ?? "0").toFixed(2)} big />
        <InfoCell label={t("isCards.balanceCash")} value={parseFloat(card.cash ?? "0").toFixed(2)} big />
        <InfoCell label={t("isCards.owner")} value={card.owner_name || card.owner || "—"} />
        <InfoCell label={t("isCards.created")} value={card.create_time || "—"} />
        {card.name && <InfoCell label={t("isCards.plan")} value={card.name} />}
        {card.last_day && <InfoCell label={t("isCards.expires")} value={card.last_day} />}
        {card.shopname && <InfoCell label={t("isCards.lastUsed")} value={card.shopname} />}
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
          <Link2 className="w-3.5 h-3.5 text-blue-500" />
          Device assignments ({assignments.length})
        </p>
        {assignments.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No device restrictions — works on all devices</p>
        ) : (
          <div className="space-y-1.5">
            {assignments.map((a) => (
              <div key={a.deviceId} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs">
                <span className="font-mono font-semibold text-blue-800">{a.deviceId}</span>
                {a.deviceName && <span className="text-blue-600">{a.deviceName}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
        <ActionCard icon={<RefreshCw className="w-4 h-4" />} label={t("isCards.recharge")} desc={t("isCards.addDeductBalance")} color="green" onClick={() => { onClose(); onRecharge(); }} />
        <ActionCard icon={<Send className="w-4 h-4" />} label={t("isCards.remoteSwipe")} desc={t("isCards.remoteSwipeDesc")} color="blue" onClick={() => { onClose(); onNotify(); }} />
        <ActionCard icon={<Link2 className="w-4 h-4" />} label={t("isCards.assignDevices")} desc={t("isCards.limitCreateDesc")} color="purple" onClick={() => { onClose(); onLimit(); }} />
        {card.status === "normal" ? (
          <ActionCard icon={<Lock className="w-4 h-4" />} label={t("isCards.reportLost")} desc={t("isCards.blockCard")} color="orange" onClick={() => { onLoss("lost"); onClose(); }} />
        ) : (
          <ActionCard icon={<Unlock className="w-4 h-4" />} label={t("isCards.restore")} desc={t("isCards.unblockCard")} color="blue" onClick={() => { onLoss("normal"); onClose(); }} />
        )}
      </div>
    </Modal>
  );
}

// ─── Reusable UI ──────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, maxWidth = "max-w-md" }: { title: string; onClose: () => void; children: React.ReactNode; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ModalFooter({ onClose, loading, submitLabel, disabled }: { onClose: () => void; loading: boolean; submitLabel: string; disabled?: boolean }) {
  return (
    <div className="flex gap-2 pt-2">
      <button type="submit" disabled={loading || disabled} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#4A90E2] text-white text-sm font-semibold rounded-xl hover:bg-[#3a7bc8] disabled:opacity-50 transition-colors">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitLabel}
      </button>
      <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
        Cancel
      </button>
    </div>
  );
}

function ResultBanner({ success, message, data }: { success: boolean; message?: string; data?: any }) {
  return (
    <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm ${success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
      {success ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
      <div>
        <p>{message}</p>
        {data && Array.isArray(data) && data.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {data.map((d: any, i: number) => <p key={i} className="text-xs opacity-80">{d.number}: {d.err}</p>)}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCell({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2.5">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`font-semibold text-gray-900 ${big ? "text-lg" : "text-sm"}`}>{value}</p>
    </div>
  );
}

function ActionBtn({ icon, onClick, title, color }: { icon: React.ReactNode; onClick: () => void; title: string; color: "gray" | "green" | "blue" | "orange" | "purple" }) {
  const colors = {
    gray: "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
    green: "text-green-500 hover:bg-green-50 hover:text-green-700",
    blue: "text-blue-500 hover:bg-blue-50 hover:text-blue-700",
    orange: "text-orange-500 hover:bg-orange-50 hover:text-orange-700",
    purple: "text-purple-500 hover:bg-purple-50 hover:text-purple-700",
  };
  return (
    <button onClick={onClick} title={title} className={`p-1.5 rounded-lg transition-colors ${colors[color]}`}>
      {icon}
    </button>
  );
}

function ActionCard({ icon, label, desc, color, onClick }: { icon: React.ReactNode; label: string; desc: string; color: "green" | "blue" | "orange" | "purple"; onClick: () => void }) {
  const colors = {
    green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    orange: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
    purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  };
  return (
    <button onClick={onClick} className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${colors[color]}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs opacity-70">{desc}</p>
      </div>
    </button>
  );
}

const inputCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white";