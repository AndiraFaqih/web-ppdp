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
// ✅ TAMBAHAN: helper tanggal untuk notifikasi H-3
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

    if (
      !Number.isNaN(day) &&
      map[monthName] !== undefined &&
      !Number.isNaN(year)
    ) {
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

  // ✅ TAMBAHAN MINIMAL: reset + disabled state
  const resetFilters = () => {
    setFilterNomorLhp("");
    setFilterStatus("ALL");
    setFilterPic("ALL");
  };

  const resetDisabled =
    !String(filterNomorLhp || "").trim() &&
    filterStatus === "ALL" &&
    filterPic === "ALL";

  // ✅ rows yang ditampilkan = hasil filter
  const filteredRows = useMemo(() => {
    const q = String(filterNomorLhp || "").trim().toLowerCase();

    return (rowsData || []).filter((r) => {
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
  }, [rowsData, filterNomorLhp, filterStatus, filterPic]);

  const [isInputBuktiOpen, setIsInputBuktiOpen] = useState(false);
  const [isViewBuktiOpen, setIsViewBuktiOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // ✅ value per nomorLhp sekarang ARRAY history
  const [buktiByLhp, setBuktiByLhp] = useState({});

  // ✅ reset status semua row dalam 1 nomorLhp
  const resetStatusByNomorLhp = (nomorLhp) => {
    if (!nomorLhp) return;
    setRowsData((prev) =>
      prev.map((r) =>
        r.nomorLhp === nomorLhp
          ? { ...r, statusLabel: DEFAULT_STATUS, statusDot: DEFAULT_DOT }
          : r
      )
    );
  };

  // =======================
  // ✅ generate notifikasi H-3 dari rowsData
  // =======================
  useEffect(() => {
    const today = new Date();

    const notifs = rowsData
    .map((r) => {
      const due = parseTanggal(r.batasWaktu);
      if (!due) return null;

      // ✅ TAMBAHAN: kalau status sudah "Sesuai" → jangan muncul notif
      if ((r?.statusLabel || "").trim().toLowerCase() === "sesuai") return null;

      const d = diffDays(due, today);
      if (d < 0 || d > 3) return null;

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
    window.dispatchEvent(
      new CustomEvent("lhpNotificationsUpdated", { detail: notifs })
    );
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

    // coba langsung
    if (highlightAndScroll(rowId)) return;

    // kalau tidak ketemu (misal sedang ter-filter), reset filter dulu lalu coba lagi
    resetFilters(); // ✅ lebih pendek (tadinya set 3 state)

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
          statusLabel: r.status || DEFAULT_STATUS,
          statusDot:
            r.status === "Sesuai"
              ? "bg-green-500"
              : r.status === "Belum Sesuai"
              ? "bg-red-500"
              : DEFAULT_DOT,
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
    setRowsData((prev) => [
      { ...newRow, id: newRow.id || uid(prev.length) },
      ...prev,
    ]);
  };

  const handleUpdateRowDate = (rowId, newDate) => {
    if (!rowId) return;
    setRowsData((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, batasWaktu: newDate } : r))
    );
  };

  // =======================
  // ✅ update STATUS
  // =======================
  const handleUpdateRowStatus = (rowId, status) => {
    if (!rowId) return;

    const nextDot =
      status === "Sesuai"
        ? "bg-green-500"
        : status === "Belum Sesuai"
        ? "bg-red-500"
        : DEFAULT_DOT;

    setRowsData((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, statusLabel: status, statusDot: nextDot } : r
      )
    );
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
    };

    setBuktiByLhp((prev) => {
      const prevList = Array.isArray(prev[nomorLhp]) ? prev[nomorLhp] : [];
      return {
        ...prev,
        [nomorLhp]: [entry, ...prevList],
      };
    });

    setIsInputBuktiOpen(false);
  };

  // ✅ hapus 1 item bukti (history)
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
        // ✅ kalau bukti habis → reset status default
        resetStatusByNomorLhp(nomorLhp);
      } else {
        next[nomorLhp] = nextList;
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

    // ✅ delete all → reset status default
    resetStatusByNomorLhp(nomorLhp);

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
  const selectedBuktiList = selectedRow
    ? buktiByLhp[selectedRow.nomorLhp] || []
    : [];
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
        // ✅ TAMBAHAN MINIMAL: reset + disabled
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
        onUpdateStatus={handleUpdateRowStatus}
      />

      <ViewBuktiModal
        isOpen={isViewBuktiOpen}
        onClose={() => setIsViewBuktiOpen(false)}
        row={selectedRow}
        buktiList={selectedBuktiList}
        onDeleteOne={handleDeleteBuktiOne}
        onDeleteAll={handleDeleteBuktiAll}
        formatTanggal={formatTanggal}
      />
    </NavbarSidebarLayout>
  );
}
