import NavbarSidebarLayout from "../Admin/layouts/NavbarSidebar";
import { useEffect, useState } from "react";

import HeaderBar from "../../components/HeaderBar";
import Pagination from "../../components/Pagination";

import LhpTable from "../../components/LhpTable";
import InputBuktiModal from "../../components/InputBuktiModal";
import ViewBuktiModal from "../../components/ViewBuktiModal";

import { rows as initialRows } from "../../components/rows";
import { formatTanggal } from "../../components/date";

const uid = (i) =>
  crypto?.randomUUID?.()
    ? crypto.randomUUID()
    : `row-${Date.now()}-${i}-${Math.random()}`;

export default function AttendancePage() {
  const [rowsData, setRowsData] = useState(() =>
    (initialRows || []).map((r, i) => ({
      ...r,
      id: r.id || uid(i),
    }))
  );

  const [isInputBuktiOpen, setIsInputBuktiOpen] = useState(false);
  const [isViewBuktiOpen, setIsViewBuktiOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [buktiByLhp, setBuktiByLhp] = useState({});

  // =======================
  // TAHAP 1: CEK CALLBACK INPUT LHP MASUK
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
          statusLabel: r.status || "Belum Tindak Lanjut",
          statusDot: "bg-green-400",
          picNama,
          picEmail,
        });
      });
    });

    console.log("✅ NEW ROWS DIHASILKAN:", newRows);
    console.log("✅ JUMLAH ROW BARU:", newRows.length);

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
  // BUKTI MODALS (tetap)
  // =======================
  const openInputBukti = (row) => {
    setSelectedRow(row);
    setIsInputBuktiOpen(true);
  };

  const openViewBukti = (row) => {
    setSelectedRow(row);
    setIsViewBuktiOpen(true);
  };

  const handleSubmitBukti = (payload) => {
    if (!selectedRow?.nomorLhp) return;

    setBuktiByLhp((prev) => {
      const prevData = prev[selectedRow.nomorLhp];

      if (prevData?.fileUrl && prevData.fileUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(prevData.fileUrl);
        } catch (e) {}
      }

      return { ...prev, [selectedRow.nomorLhp]: payload };
    });

    setIsInputBuktiOpen(false);
  };

  const handleDeleteBukti = (nomorLhp) => {
    if (!nomorLhp) return;

    setBuktiByLhp((prev) => {
      const next = { ...prev };
      const old = next[nomorLhp];

      if (old?.fileUrl && old.fileUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(old.fileUrl);
        } catch (e) {}
      }

      delete next[nomorLhp];
      return next;
    });

    setIsViewBuktiOpen(false);
  };

  useEffect(() => {
    return () => {
      Object.values(buktiByLhp).forEach((b) => {
        if (b?.fileUrl && b.fileUrl.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(b.fileUrl);
          } catch (e) {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <HeaderBar
        rows={rowsData}
        onAddLhpPayload={handleAddLhpPayload}   // ✅ ini yang penting untuk tahap 1
        onAddUpdateRow={handleAddUpdateRow}
        onUpdateRowDate={handleUpdateRowDate}
      />

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <LhpTable
                rows={rowsData}
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
        existing={selectedRow ? buktiByLhp[selectedRow.nomorLhp] : null}
        onSubmit={handleSubmitBukti}
      />

      <ViewBuktiModal
        isOpen={isViewBuktiOpen}
        onClose={() => setIsViewBuktiOpen(false)}
        row={selectedRow}
        bukti={selectedRow ? buktiByLhp[selectedRow.nomorLhp] : null}
        onDelete={handleDeleteBukti}
        formatTanggal={formatTanggal}
      />
    </NavbarSidebarLayout>
  );
}
