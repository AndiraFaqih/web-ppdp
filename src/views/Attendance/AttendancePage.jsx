// src/views/Attendance/AttendancePage.jsx
import NavbarSidebarLayout from "../Admin/layouts/NavbarSidebar";
import { useEffect, useMemo, useState } from "react";

import HeaderBar from "../../components/HeaderBar";
import Pagination from "../../components/Pagination";

import LhpTable from "../../components/LhpTable";
import InputBuktiModal from "../../components/InputBuktiModal";
import ViewBuktiModal from "../../components/ViewBuktiModal";

import { rows as initialRows } from "../../components/rows";
import { formatTanggal } from "../../components/date";

// =======================
// ✅ helper tanggal untuk notifikasi H-3
// =======================
const parseTanggal = (s) => {
  if (!s) return null;

  // format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T00:00:00`);
    return isNaN(d) ? null : d;
  }

  // format "30 Juni 2025"
  const parts = String(s).trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);

    const map = {
      januari: 0,
      februari: 1,
      maret: 2,
      april: 3,
      mei: 4,
      juni: 5,
      juli: 6,
      agustus: 7,
      september: 8,
      oktober: 9,
      november: 10,
      desember: 11,
    };

    if (!Number.isNaN(day) && map[monthName] !== undefined && !Number.isNaN(year)) {
      const d = new Date(year, map[monthName], day);
      return isNaN(d) ? null : d;
    }
  }

  return null;
};

const dateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const diffDays = (due, today) =>
  Math.round((dateOnly(due) - dateOnly(today)) / (1000 * 60 * 60 * 24));

const uid = (i) =>
  crypto?.randomUUID?.()
    ? crypto.randomUUID()
    : `row-${Date.now()}-${i}-${Math.random()}`;

// ✅ default status ketika bukti kosong
const DEFAULT_STATUS = "Belum Tindak Lanjut";
const DEFAULT_DOT = "bg-green-400";

export default function AttendancePage() {
  const [rowsData, setRowsData] = useState(() =>
    (initialRows || []).map((r, i) => ({
      ...r,
      id: r.id || uid(i),
    }))
  );

  // =======================
  // ✅ FILTER STATE
  // =======================
  const [filterNomorLhp, setFilterNomorLhp] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPic, setFilterPic] = useState("ALL");

  // ✅ reset + disabled state
  const resetFilters = () => {
    setFilterNomorLhp("");
    setFilterStatus("ALL");
    setFilterPic("ALL");
  };

  const resetDisabled =
    !String(filterNomorLhp || "").trim() && filterStatus === "ALL" && filterPic === "ALL";

  // ✅ rows yang ditampilkan = hasil filter + SORT nomor LHP (besar → kecil)
  const filteredRows = useMemo(() => {
    const q = String(filterNomorLhp || "").trim().toLowerCase();

    const list = (rowsData || []).filter((r) => {
      const status = String(r?.statusLabel || "");
      const pic = String(r?.picNama || "");

      // ✅ GLOBAL KEYWORD SEARCH
      const haystack = [
        r?.nomorLhp,
        r?.temuan,
        r?.rekomendasi,
        r?.batasWaktu,
        r?.statusLabel,
        r?.picNama,
        r?.picEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchKeyword = !q || haystack.includes(q);
      const matchStatus = filterStatus === "ALL" || status === filterStatus;
      const matchPic = filterPic === "ALL" || pic === filterPic;

      return matchKeyword && matchStatus && matchPic;
    });

    // ✅ SORT nomor LHP: besar → kecil (yang kecil di bawah)
    list.sort((a, b) => {
      const an = String(a?.nomorLhp || "");
      const bn = String(b?.nomorLhp || "");

      // kosong taruh paling bawah
      if (!an && !bn) return 0;
      if (!an) return 1;
      if (!bn) return -1;

      const c = an.localeCompare(bn, "id", { numeric: true, sensitivity: "base" });
      if (c !== 0) return -c; // ✅ descending

      // tie-breaker biar stabil
      return String(a?.id || "").localeCompare(String(b?.id || ""));
    });

    return list;
  }, [rowsData, filterNomorLhp, filterStatus, filterPic]);

  const [isInputBuktiOpen, setIsInputBuktiOpen] = useState(false);
  const [isViewBuktiOpen, setIsViewBuktiOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // ✅ value per nomorLhp sekarang ARRAY history (newest di index 0)
  const [buktiByLhp, setBuktiByLhp] = useState({});

  // ✅ dot mengikuti variasi status baru
  const dotByStatus = (status) => {
    const s = String(status || "").trim().toLowerCase();
    if (s.startsWith("sesuai")) return "bg-green-500";
    if (s.includes("belum sesuai")) return "bg-red-500";
    return DEFAULT_DOT;
  };

  // ✅ status dari bukti terbaru:
  // - belum ada bukti => "Belum Tindak Lanjut"
  // - kalau input bukti status "Belum Sesuai" => tetap "Belum Sesuai" (meskipun pending/approved)
  // - kalau input bukti "Sesuai" => "Sesuai - Pending Approval_1/_2" sampai APPROVED
  const statusFromLatestBukti = (list) => {
    const arr = Array.isArray(list) ? list : [];
    if (arr.length === 0) return DEFAULT_STATUS;

    const latest = arr[0];

    // status pilihan saat input bukti (dukungan beberapa nama field biar aman)
    const picked = (
      latest?.status ||
      latest?.pickedStatus ||
      latest?.statusLabel ||
      latest?.statusTindakLanjut ||
      ""
    )
      .toString()
      .trim()
      .toLowerCase();

    const appr = String(latest?.approval?.state || "").toUpperCase();

    // ✅ PRIORITAS: kalau user pilih "Belum Sesuai" tetap "Belum Sesuai"
    if (picked === "belum sesuai") {
      return appr === "REJECTED" ? "Belum Sesuai - Ditolak" : "Belum Sesuai";
    }

    // kalau approval ditolak, tetap masuk kategori "Belum Sesuai" biar kena alert
    if (appr === "REJECTED") return "Belum Sesuai - Ditolak";

    if (appr === "APPROVED") return "Sesuai";
    if (appr === "PENDING_2") return "Sesuai - Pending Approval_2";
    // default pending 1 (atau state kosong)
    return "Sesuai - Pending Approval_1";
  };

  // ✅ set status semua row dalam 1 nomorLhp
  const resetStatusByNomorLhp = (nomorLhp, status = DEFAULT_STATUS) => {
    if (!nomorLhp) return;
    setRowsData((prev) =>
      prev.map((r) =>
        r.nomorLhp === nomorLhp ? { ...r, statusLabel: status, statusDot: dotByStatus(status) } : r
      )
    );
  };

  // ✅ AUTO-SYNC: setiap bukti berubah/approval berubah, status row mengikuti bukti latest
  useEffect(() => {
    setRowsData((prev) =>
      prev.map((r) => {
        const derived = statusFromLatestBukti(buktiByLhp?.[r.nomorLhp]);
        const nextDot = dotByStatus(derived);

        if ((r.statusLabel || DEFAULT_STATUS) === derived && (r.statusDot || DEFAULT_DOT) === nextDot) {
          return r;
        }
        return { ...r, statusLabel: derived, statusDot: nextDot };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buktiByLhp]);

  // =======================
  // ✅ generate notifikasi H-3 dari rowsData
  // =======================
  useEffect(() => {
    const today = new Date();

    const notifs = rowsData
      .map((r) => {
        const due = parseTanggal(r.batasWaktu);
        if (!due) return null;

        // ✅ kalau status sudah "Sesuai" (termasuk pending approval) → jangan muncul notif
        const s = String(r?.statusLabel || "").trim().toLowerCase();
        if (s.startsWith("sesuai")) return null;

        const d = diffDays(due, today);
        if (d < 0 || d > 3) return null; // ✅ H-3

        return {
          key: r.id,
          rowId: r.id,
          nomorLhp: r.nomorLhp,
          batasWaktu: r.batasWaktu,
          rekomPreview: r.rekomendasi
            ? r.rekomendasi.length > 80
              ? r.rekomendasi.slice(0, 80) + "..."
              : r.rekomendasi
            : "",
        };
      })
      .filter(Boolean);

    localStorage.setItem("lhp_notifications", JSON.stringify(notifs));
    window.dispatchEvent(new CustomEvent("lhpNotificationsUpdated", { detail: notifs }));
  }, [rowsData]);

  // =======================
  // ✅ scroll ke row saat notif diklik
  // =======================
  const highlightAndScroll = (rowId) => {
    const el = document.getElementById(`row-${rowId}`);
    if (!el) return false;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    el.classList.add("bg-yellow-50", "dark:bg-yellow-900/20");
    setTimeout(() => {
      el.classList.remove("bg-yellow-50", "dark:bg-yellow-900/20");
    }, 2000);

    return true;
  };

  const scrollToRow = ({ rowId }) => {
    if (!rowId) return;

    if (highlightAndScroll(rowId)) return;

    resetFilters();
    setTimeout(() => {
      highlightAndScroll(rowId);
    }, 300);
  };

  useEffect(() => {
    const handler = (e) => {
      const detail = e?.detail || {};
      scrollToRow(detail);
    };

    window.addEventListener("goToLhpRow", handler);

    const pending = localStorage.getItem("lhp_scroll_target");
    if (pending) {
      try {
        const detail = JSON.parse(pending);
        localStorage.removeItem("lhp_scroll_target");
        setTimeout(() => scrollToRow(detail), 250);
      } catch {}
    }

    return () => window.removeEventListener("goToLhpRow", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =======================
  // INPUT LHP
  // =======================
  const handleAddLhpPayload = (payload) => {
    console.log("✅ PAYLOAD DARI AddLhpModal:", payload);

    if (!payload?.nomorLhp) {
      console.warn("⚠️ payload.nomorLhp kosong, dibatalkan");
      return;
    }

    const newRows = [];
    const nomorLhp = payload.nomorLhp;
    const picNama = payload.pic || "";
    const picEmail = payload.emailPic || "";

    (payload.temuan || []).forEach((t) => {
      const temuanText = (t.temuan || "").trim();
      (t.rekomendasi || []).forEach((r) => {
        newRows.push({
          id: uid(newRows.length),
          nomorLhp,
          temuan: temuanText,
          rekomendasi: (r.rekomendasi || "").trim(),
          batasWaktu: r.batasWaktu || "",
          statusLabel: DEFAULT_STATUS,
          statusDot: DEFAULT_DOT,
          picNama,
          picEmail,
        });
      });
    });

    setRowsData((prev) => [...newRows, ...prev]);
  };

  // =======================
  // UPDATE DATA (tetap)
  // =======================
  const handleAddUpdateRow = (newRow) => {
    setRowsData((prev) => [{ ...newRow, id: newRow.id || uid(prev.length) }, ...prev]);
  };

  const handleUpdateRowDate = (rowId, newDate) => {
    if (!rowId) return;
    setRowsData((prev) => prev.map((r) => (r.id === rowId ? { ...r, batasWaktu: newDate } : r)));
  };

  // =======================
  // BUKTI MODALS
  // =======================
  const openInputBukti = (row) => {
    setSelectedRow(row);
    setIsInputBuktiOpen(true);
  };

  const openViewBukti = (row) => {
    setSelectedRow(row);
    setIsViewBuktiOpen(true);
  };

  // ✅ simpan sebagai HISTORY (array)
  const handleSubmitBukti = (payload) => {
    if (!selectedRow?.nomorLhp) return;

    const nomorLhp = selectedRow.nomorLhp;

    const entry = {
      id: uid("bukti"),
      ...payload,
      createdAt: new Date().toISOString(),

      // ✅ simpan juga status pilihan saat input (biar bisa dipakai statusFromLatestBukti)
      status:
        payload?.status || payload?.pickedStatus || payload?.statusLabel || payload?.statusTindakLanjut || "Sesuai",

      approval: {
        state: "PENDING_1", // PENDING_1 | PENDING_2 | APPROVED | REJECTED
        history: [],
      },
    };

    setBuktiByLhp((prev) => {
      const prevList = Array.isArray(prev[nomorLhp]) ? prev[nomorLhp] : [];
      return { ...prev, [nomorLhp]: [entry, ...prevList] };
    });

    setIsInputBuktiOpen(false);
  };

  // ✅ approve/reject bukti tertentu
  const handleApprovalAction = (nomorLhp, buktiId, action, meta = {}) => {
    if (!nomorLhp || !buktiId) return;

    setBuktiByLhp((prev) => {
      const list = Array.isArray(prev[nomorLhp]) ? prev[nomorLhp] : [];

      const nextList = list.map((b) => {
        if (b.id !== buktiId) return b;

        const approval = b.approval || { state: "PENDING_1", history: [] };
        const now = new Date().toISOString();

        const nextHistory = [
          {
            action, // APPROVE / REJECT
            at: now,
            note: meta.note || "",
            byName: meta.byName || "",
            byEmail: meta.byEmail || "",
            fromState: approval.state,
          },
          ...(approval.history || []),
        ];

        let nextState = approval.state;
        if (action === "APPROVE") {
          nextState = approval.state === "PENDING_1" ? "PENDING_2" : "APPROVED";
        } else if (action === "REJECT") {
          nextState = "REJECTED";
        }

        return { ...b, approval: { ...approval, state: nextState, history: nextHistory } };
      });

      return { ...prev, [nomorLhp]: nextList };
    });
  };

  // ✅ hapus 1 item bukti
  const handleDeleteBuktiOne = (nomorLhp, buktiId) => {
    if (!nomorLhp || !buktiId) return;

    setBuktiByLhp((prev) => {
      const prevList = Array.isArray(prev[nomorLhp]) ? prev[nomorLhp] : [];
      const target = prevList.find((b) => b.id === buktiId);

      if (target?.fileUrl && target.fileUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(target.fileUrl);
        } catch (e) {}
      }

      const nextList = prevList.filter((b) => b.id !== buktiId);
      const next = { ...prev };

      if (nextList.length === 0) {
        delete next[nomorLhp];
        resetStatusByNomorLhp(nomorLhp, DEFAULT_STATUS);
      } else {
        next[nomorLhp] = nextList;
        resetStatusByNomorLhp(nomorLhp, statusFromLatestBukti(nextList));
      }

      return next;
    });
  };

  // ✅ hapus semua history bukti untuk 1 LHP
  const handleDeleteBuktiAll = (nomorLhp) => {
    if (!nomorLhp) return;

    setBuktiByLhp((prev) => {
      const prevList = Array.isArray(prev[nomorLhp]) ? prev[nomorLhp] : [];

      prevList.forEach((b) => {
        if (b?.fileUrl && b.fileUrl.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(b.fileUrl);
          } catch (e) {}
        }
      });

      const next = { ...prev };
      delete next[nomorLhp];
      return next;
    });

    resetStatusByNomorLhp(nomorLhp, DEFAULT_STATUS);
    setIsViewBuktiOpen(false);
  };

  // cleanup blob urls saat unmount
  useEffect(() => {
    return () => {
      Object.values(buktiByLhp).forEach((list) => {
        if (!Array.isArray(list)) return;
        list.forEach((b) => {
          if (b?.fileUrl && b.fileUrl.startsWith("blob:")) {
            try {
              URL.revokeObjectURL(b.fileUrl);
            } catch (e) {}
          }
        });
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ ambil latest bukti (untuk prefill modal)
  const selectedBuktiList = selectedRow ? buktiByLhp[selectedRow.nomorLhp] || [] : [];
  const latestBukti = selectedBuktiList?.[0] || null;

  return (
    <NavbarSidebarLayout isFooter={false}>
      <HeaderBar
        rows={rowsData}
        onAddLhpPayload={handleAddLhpPayload}
        onAddUpdateRow={handleAddUpdateRow}
        onUpdateRowDate={handleUpdateRowDate}
        // ✅ props filter
        filterNomorLhp={filterNomorLhp}
        onChangeFilterNomorLhp={setFilterNomorLhp}
        filterStatus={filterStatus}
        onChangeFilterStatus={setFilterStatus}
        filterPic={filterPic}
        onChangeFilterPic={setFilterPic}
        // ✅ reset + disabled
        onResetFilters={resetFilters}
        resetDisabled={resetDisabled}
      />

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <LhpTable
                rows={filteredRows}
                buktiByLhp={buktiByLhp}
                formatTanggal={formatTanggal}
                onOpenInputBukti={openInputBukti}
                onOpenViewBukti={openViewBukti}
              />
            </div>
          </div>
        </div>
      </div>

      <Pagination />

      <InputBuktiModal
        isOpen={isInputBuktiOpen}
        onClose={() => setIsInputBuktiOpen(false)}
        row={selectedRow}
        existing={latestBukti}
        onSubmit={handleSubmitBukti}
        // ✅ status otomatis dari bukti+approval (tidak pakai onUpdateStatus)
      />

      <ViewBuktiModal
        isOpen={isViewBuktiOpen}
        onClose={() => setIsViewBuktiOpen(false)}
        row={selectedRow}
        buktiList={selectedBuktiList}
        onDeleteOne={handleDeleteBuktiOne}
        onDeleteAll={handleDeleteBuktiAll}
        formatTanggal={formatTanggal}
        onApprovalAction={handleApprovalAction}
      />
    </NavbarSidebarLayout>
  );
}
