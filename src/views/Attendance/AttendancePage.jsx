// src/views/Attendance/AttendancePage.jsx
import NavbarSidebarLayout from "../Admin/layouts/NavbarSidebar";
import { useEffect, useMemo, useState } from "react";

import HeaderBar from "../../components/HeaderBar";
import Pagination from "../../components/Pagination";

import LhpTable from "../../components/LhpTable";
import InputBuktiModal from "../../components/InputBuktiModal";
import ViewBuktiModal from "../../components/ViewBuktiModal";

import { formatTanggal } from "../../components/date";
import { laporanService } from "../../service/laporan-service";
import { rekomendasiService } from "../../service/rekomendasi-service";
import baseUrl from "../../service/base-url";

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

  // format Date object
  if (s instanceof Date) {
    return isNaN(s.getTime()) ? null : s;
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

// Helper untuk mapping status backend ke frontend
const mapStatusToFrontend = (backendStatus) => {
  if (!backendStatus) return DEFAULT_STATUS;
  const status = backendStatus.toString().trim();
  
  const statusMap = {
    "BELUM TINDAK LANJUT": "Belum Tindak Lanjut",
    "SESUAI PENDING APPROVAL 1": "Sesuai - Pending Approval_1",
    "SESUAI PENDING APPROVAL 2": "Sesuai - Pending Approval_2",
    "SESUAI": "Sesuai",
    "BELUM SESUAI": "Belum Sesuai",
    "BELUM SESUAI - DITOLAK": "Belum Sesuai - Ditolak",
  };

  return statusMap[status] || status;
};

// Transform backend laporan data to frontend rows
const transformLaporanToRows = (laporanList) => {
  const rows = [];

  laporanList.forEach((laporan) => {
    const nomorLHP = laporan.nomorLHP || laporan.nomorLhp;
    const pic = laporan.PIC || "";
    const perusahaan = laporan.perusahaan || laporan.perusahaanNama || "";
    const temuanList = laporan.temuan || [];
    const rekomendasiList = laporan.rekomendasi || [];

    // Expand: setiap kombinasi temuan x rekomendasi menjadi 1 row
    // Status sekarang per rekomendasi, bukan per laporan
    if (temuanList.length === 0 || rekomendasiList.length === 0) {
      // Jika tidak ada temuan atau rekomendasi, buat row kosong
      rows.push({
        id: uid(rows.length),
        nomorLhp: nomorLHP,
        temuan: "",
        rekomendasi: "",
        batasWaktu: laporan.batasWaktu ? new Date(laporan.batasWaktu).toISOString().split('T')[0] : "",
        statusLabel: DEFAULT_STATUS,
        statusDot: dotByStatus(DEFAULT_STATUS),
        picNama: pic,
        picEmail: "",
        perusahaanNama: perusahaan,
        laporanId: laporan.id,
        temuanId: null,
        rekomendasiId: null,
      });
    } else {
      // Create a map of temuanId -> temuan for quick lookup
      const temuanMap = new Map(temuanList.map((t) => [t.id, t]));
      
      // Each rekomendasi now has temuanId, use that for direct pairing
      rekomendasiList.forEach((rek, idx) => {
        // Find the temuan this rekomendasi belongs to via temuanId
        const linkedTemuan = rek.temuanId ? temuanMap.get(rek.temuanId) : null;
        
        // Fallback: if no temuanId, try matching via [TIDX:X] prefix (for old data)
        let temuanDeskripsi = linkedTemuan?.deskripsi || "";
        let temuanId = linkedTemuan?.id || null;
        
        if (!linkedTemuan) {
          // Old data fallback using [TIDX:X] prefix matching
          const rekIsi = rek.isi || "";
          const rekMatch = rekIsi.match(/^\[TIDX:(\d+)\]/);
          
          if (rekMatch) {
            const rekTemuanIdx = parseInt(rekMatch[1], 10);
            // Find temuan with matching index
            for (const [tId, t] of temuanMap) {
              const tMatch = t.deskripsi?.match(/^\[TIDX:(\d+)\]/);
              const tIdx = tMatch ? parseInt(tMatch[1], 10) : -1;
              if (tIdx === rekTemuanIdx) {
                temuanDeskripsi = t.deskripsi;
                temuanId = tId;
                break;
              }
            }
          } else if (temuanList.length > 0) {
            // No prefix, use first temuan as fallback
            temuanDeskripsi = temuanList[0].deskripsi || "";
            temuanId = temuanList[0].id;
          }
        }
        
        // Clean prefixes from display text
        const cleanTemuanDeskripsi = temuanDeskripsi.replace(/^\[TIDX:\d+\]/, "");
        const cleanRekIsi = (rek.isi || "").replace(/^\[TIDX:\d+\]/, "");
        
        // Status dari rekomendasi (default "BELUM TINDAK LANJUT" jika tidak ada)
        const rekStatus = rek.status || "BELUM TINDAK LANJUT";
        const statusLabel = mapStatusToFrontend(rekStatus);
        
        rows.push({
          id: uid(`${rows.length}-${idx}`),
          nomorLhp: nomorLHP,
          temuan: cleanTemuanDeskripsi,
          rekomendasi: cleanRekIsi,
          batasWaktu: laporan.batasWaktu ? new Date(laporan.batasWaktu).toISOString().split('T')[0] : "",
          statusLabel,
          statusDot: dotByStatus(statusLabel),
          picNama: pic,
          picEmail: "",
          perusahaanNama: perusahaan,
          laporanId: laporan.id,
          temuanId: temuanId,
          rekomendasiId: rek.id,
        });
      });
    }
  });

  return rows;
};

// ✅ dot mengikuti variasi status baru
const dotByStatus = (status) => {
  const s = String(status || "").trim().toLowerCase();
  if (s.startsWith("sesuai")) return "bg-green-500";
  if (s.includes("belum sesuai")) return "bg-red-500";
  return DEFAULT_DOT;
};

export default function AttendancePage() {
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =======================
  // ✅ FILTER STATE
  // =======================
  const [filterNomorLhp, setFilterNomorLhp] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPic, setFilterPic] = useState("ALL");
  const [filterPerusahaan, setFilterPerusahaan] = useState("ALL");

  // ✅ reset + disabled state
  const resetFilters = () => {
    setFilterNomorLhp("");
    setFilterStatus("ALL");
    setFilterPic("ALL");
    setFilterPerusahaan("ALL");
  };

  const resetDisabled =
    !String(filterNomorLhp || "").trim() && filterStatus === "ALL" && filterPic === "ALL" && filterPerusahaan === "ALL";

  // ✅ rows yang ditampilkan = hasil filter + SORT nomor LHP (besar → kecil)
  const filteredRows = useMemo(() => {
    const q = String(filterNomorLhp || "").trim().toLowerCase();

    const list = (rowsData || []).filter((r) => {
      const status = String(r?.statusLabel || "");
      const pic = String(r?.picNama || "");
      const perusahaan = String(r?.perusahaanNama || "");

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
      const matchPerusahaan = filterPerusahaan === "ALL" || perusahaan === filterPerusahaan;

      return matchKeyword && matchStatus && matchPic && matchPerusahaan;
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
  }, [rowsData, filterNomorLhp, filterStatus, filterPic, filterPerusahaan]);

  const [isInputBuktiOpen, setIsInputBuktiOpen] = useState(false);
  const [isViewBuktiOpen, setIsViewBuktiOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // ✅ value per rekomendasiId sekarang ARRAY history (newest di index 0)
  const [buktiByRekom, setBuktiByRekom] = useState({});

  // Note: Status sekarang di-manage per rekomendasi di backend
  // Setelah fetch data dari backend, status sudah benar dari rekomendasi.status
  // Tidak perlu sync manual karena backend sudah update status rekomendasi setelah upload/approval

  // =======================
  // ✅ FETCH DATA FROM BACKEND
  // =======================
  const fetchLaporan = async () => {
    setLoading(true);
    setError(null);
    try {
      const laporanList = await laporanService.getLaporan();
      
      // Transform to rows
      const transformedRows = transformLaporanToRows(laporanList);
      setRowsData(transformedRows);

      // Fetch dokumen for each laporan
      const buktiMap = {};
      for (const laporan of laporanList) {
        const nomorLHP = laporan.nomorLHP || laporan.nomorLhp;
        if (!nomorLHP) continue;

        try {
          const dokumenData = await laporanService.getDokumenByNomorLHP(nomorLHP);
          const dokumenList = dokumenData.dokumen || [];

          // Transform dokumen to bukti format, grouped per rekomendasi
          // Map rekomendasi by id for quick lookup
          const rekomMap = new Map((laporan.rekomendasi || []).map((r) => [r.id, r]));
          
          dokumenList.forEach((dok) => {
            if (!dok.rekomendasiId) {
              return;
            }

            const targetList = buktiMap[dok.rekomendasiId] || [];

            // Backend returns url like "/dokumen/{id}/file" (tanpa /api)
            // Construct full URL by prepending baseUrl
            let fileUrl = null;
            if (dok.url) {
              // If url already starts with http, use as-is (full URL)
              if (dok.url.startsWith('http')) {
                fileUrl = dok.url;
              } else {
                // Prepend baseUrl to relative path
                const base = baseUrl().replace(/\/$/, ''); // Remove trailing slash
                const urlPath = dok.url.startsWith('/') ? dok.url : `/${dok.url}`;
                fileUrl = `${base}${urlPath}`;
              }
            }
            
            // Get rekomendasi status from the associated rekomendasi
            const rekomendasi = dok.rekomendasiId ? rekomMap.get(dok.rekomendasiId) : null;
            const rekStatus = rekomendasi?.status || "BELUM TINDAK LANJUT";
            const statusLabel = mapStatusToFrontend(rekStatus);
            
            // Determine approval state from status
            let approvalState = "PENDING_1";
            if (statusLabel === "Sesuai") {
              approvalState = "APPROVED";
            } else if (statusLabel.includes("Pending Approval_2")) {
              approvalState = "PENDING_2";
            } else if (statusLabel.includes("Ditolak")) {
              approvalState = "REJECTED";
            }
            
            targetList.push({
              id: dok.id.toString(),
              tanggalUpload: dok.tanggalUpload ? new Date(dok.tanggalUpload).toISOString().split('T')[0] : "",
              keterangan: dok.keterangan || "",
              fileUrl,
              fileName: dok.originalName || dok.filename || "",
              fileSize: dok.size || 0,
              rekomendasiId: dok.rekomendasiId, // Store rekomendasiId for approval actions
              status: statusLabel,
              createdAt: dok.createdAt ? new Date(dok.createdAt).toISOString() : new Date().toISOString(),
              approval: {
                state: approvalState,
                history: [],
              },
            });

            buktiMap[dok.rekomendasiId] = targetList;
          });
        } catch (err) {
          console.error(`Error fetching dokumen for ${nomorLHP}:`, err);
        }
      }

      setBuktiByRekom(buktiMap);
    } catch (err) {
      console.error("Error fetching laporan:", err);
      setError("Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

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
      } catch (err) {
        console.error("Error parsing scroll target:", err);
      }
    }

    return () => window.removeEventListener("goToLhpRow", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =======================
  // INPUT LHP
  // =======================
  const handleAddLhpPayload = async (payload) => {
    console.log("✅ PAYLOAD DARI AddLhpModal:", payload);

    if (!payload?.nomorLhp) {
      console.warn("⚠️ payload.nomorLhp kosong, dibatalkan");
      return;
    }

    try {
      // Transform payload to backend format - each temuan contains its rekomendasi
      const temuan = (payload.temuan || []).map((t) => ({
        deskripsi: t.temuan || "",
        rekomendasi: (t.rekomendasi || []).map((r) => ({
          isi: r.rekomendasi || "",
        })),
      }));

      // Use the first batasWaktu from rekomendasi (backend expects single batasWaktu on laporan)
      const firstBatasWaktu = payload.temuan?.[0]?.rekomendasi?.[0]?.batasWaktu || "";

      const laporanData = {
        nomorLHP: payload.nomorLhp.trim(),
        PIC: payload.pic.trim(),
        perusahaan: payload.perusahaan.trim(),
        batasWaktu: firstBatasWaktu,
        temuan,
      };

      await laporanService.addLaporan(laporanData);

      // Refresh data
      await fetchLaporan();
    } catch (error) {
      console.error("Error adding laporan:", error);
      alert("Gagal menambah LHP: " + (error.message || "Unknown error"));
    }
  };

  // =======================
  // UPDATE DATA
  // =======================
  const handleAddUpdateRow = async (newRow) => {
    if (!newRow?.nomorLhp) return;

    try {
      // Add new rekomendasi
      await rekomendasiService.addRekomendasi(newRow.nomorLhp, {
        isi: newRow.rekomendasi,
      });

      // Update batasWaktu if needed (this updates the laporan's batasWaktu)
      if (newRow.batasWaktu) {
        await laporanService.updateLaporan(newRow.nomorLhp, {
          batasWaktu: newRow.batasWaktu,
        });
      }

      // Refresh data
      await fetchLaporan();
    } catch (error) {
      console.error("Error adding update row:", error);
      alert("Gagal menambah rekomendasi: " + (error.message || "Unknown error"));
    }
  };

  const handleUpdateRowDate = async (rowId, newDate) => {
    if (!rowId) return;

    try {
      const row = rowsData.find((r) => r.id === rowId);
      if (!row || !row.rekomendasiId) return;

      // Update rekomendasi date by updating the laporan's batasWaktu
      // Note: Backend stores batasWaktu on laporan level, not rekomendasi level
      await laporanService.updateLaporan(row.nomorLhp, {
        batasWaktu: newDate,
      });

      // Refresh data
      await fetchLaporan();
    } catch (error) {
      console.error("Error updating row date:", error);
      alert("Gagal mengupdate tanggal: " + (error.message || "Unknown error"));
    }
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

  // ✅ simpan sebagai HISTORY (array) + upload to backend
  const handleSubmitBukti = async (payload) => {
    if (!selectedRow?.nomorLhp) return;

    const nomorLhp = selectedRow.nomorLhp;

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Check if file is provided (it should be a File object from the input)
      // Note: Field name "file" may need to match your multer configuration in backend route
      if (payload.file) {
        formData.append("file", payload.file);
      } else if (payload.fileUrl && payload.fileUrl.startsWith("blob:")) {
        // If it's a blob URL, we need to fetch it first
        const response = await fetch(payload.fileUrl);
        const blob = await response.blob();
        const file = new File([blob], payload.fileName || "bukti", { type: blob.type });
        formData.append("file", file);
      } else {
        throw new Error("File bukti wajib di-upload");
      }

      formData.append("tanggalUpload", payload.tanggalUpload);
      if (payload.keterangan) {
        formData.append("keterangan", payload.keterangan);
      }

      // Map frontend status to backend status for upload
      // Backend accepts multiple statuses now: "SESUAI PENDING APPROVAL 1", "BELUM SESUAI", etc.
      let backendStatus = null;
      const frontendStatus = payload.status?.toString().trim().toLowerCase();
      if (frontendStatus === "sesuai" || frontendStatus?.startsWith("sesuai")) {
        backendStatus = "SESUAI PENDING APPROVAL 1";
      } else if (frontendStatus === "belum sesuai" || frontendStatus?.includes("belum sesuai")) {
        backendStatus = "BELUM SESUAI";
      }
      
      // Send statusRekomendasi (not statusLaporan) - backend will update rekomendasi status
      if (backendStatus) {
        formData.append("statusRekomendasi", backendStatus);
      }

      // Get rekomendasiId from selectedRow
      const rekomendasiId = selectedRow?.rekomendasiId;

      // Upload to backend with rekomendasiId in query
      await laporanService.uploadDokumen(nomorLhp, formData, rekomendasiId);

      // Refresh data to get updated dokumen list
      await fetchLaporan();

      setIsInputBuktiOpen(false);
    } catch (error) {
      console.error("Error submitting bukti:", error);
      alert("Gagal mengupload bukti: " + (error.message || "Unknown error"));
    }
  };

  // ✅ approve/reject bukti tertentu
  const handleApprovalAction = async (nomorLhp, buktiId, action) => {
    if (!nomorLhp || !buktiId) return;

    try {
      // Get bukti to find rekomendasiId (hanya untuk rekomendasi terkait)
      const allBukti = Object.values(buktiByRekom).flat();
      const currentBukti = allBukti.find((b) => b.id === buktiId);

      if (!currentBukti?.rekomendasiId) {
        throw new Error("Rekomendasi ID tidak ditemukan untuk bukti ini");
      }

      const rekomendasiId = currentBukti.rekomendasiId;

      if (action === "APPROVE") {
        // Check current status to determine which approval to call
        const currentState = currentBukti?.approval?.state || "PENDING_1";

        if (currentState === "PENDING_1") {
          await laporanService.buktiFirstApprovalByNomorLHP(nomorLhp, rekomendasiId);
        } else if (currentState === "PENDING_2") {
          await laporanService.buktiSecondApprovalByNomorLHP(nomorLhp, rekomendasiId);
        }
      } else if (action === "REJECT") {
        await laporanService.rejectBuktiByNomorLHP(nomorLhp, rekomendasiId);
      }

      // Refresh data
      await fetchLaporan();
    } catch (error) {
      console.error("Error approval action:", error);
      alert("Gagal melakukan approval: " + (error.message || "Unknown error"));
    }
  };

  // ✅ hapus 1 item bukti
  const handleDeleteBuktiOne = async (nomorLhp, buktiId) => {
    if (!nomorLhp || !buktiId) return;

    try {
      await laporanService.deleteDokumen(parseInt(buktiId));

      // Refresh data
      await fetchLaporan();
    } catch (error) {
      console.error("Error deleting bukti:", error);
      alert("Gagal menghapus bukti: " + (error.message || "Unknown error"));
    }
  };

  // ✅ hapus semua history bukti untuk 1 rekomendasi
  const handleDeleteBuktiAll = async (nomorLhp) => {
    if (!nomorLhp) return;

    try {
      const rekomendasiId = selectedRow?.rekomendasiId;
      const buktiList = rekomendasiId ? buktiByRekom[rekomendasiId] || [] : [];

      for (const bukti of buktiList) {
        try {
          await laporanService.deleteDokumen(parseInt(bukti.id));
        } catch (err) {
          console.error(`Error deleting dokumen ${bukti.id}:`, err);
        }
      }

      // Refresh data
      await fetchLaporan();
      setIsViewBuktiOpen(false);
    } catch (error) {
      console.error("Error deleting all bukti:", error);
      alert("Gagal menghapus semua bukti: " + (error.message || "Unknown error"));
    }
  };

  // ✅ ambil bukti per rekomendasi saja (hindari tercampur antar rekom dalam 1 LHP)
  const selectedBuktiList = selectedRow
    ? buktiByRekom[selectedRow.rekomendasiId] || []
    : [];
  const latestBukti = selectedBuktiList?.[0] || null;

  if (loading) {
    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-4 text-lg text-gray-600 dark:text-gray-400">Memuat data...</div>
          </div>
        </div>
      </NavbarSidebarLayout>
    );
  }

  if (error) {
    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-4 text-lg text-red-600">{error}</div>
            <button
              onClick={fetchLaporan}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </NavbarSidebarLayout>
    );
  }

  return (
    <NavbarSidebarLayout isFooter={false}>
      <HeaderBar
        rows={rowsData}
        onAddLhpPayload={handleAddLhpPayload}
        onAddUpdateRow={handleAddUpdateRow}
        onUpdateRowDate={handleUpdateRowDate}
        onRefresh={fetchLaporan}
        // ✅ props filter
        filterNomorLhp={filterNomorLhp}
        onChangeFilterNomorLhp={setFilterNomorLhp}
        filterStatus={filterStatus}
        onChangeFilterStatus={setFilterStatus}
        filterPic={filterPic}
        onChangeFilterPic={setFilterPic}
        filterPerusahaan={filterPerusahaan}
        onChangeFilterPerusahaan={setFilterPerusahaan}
        // ✅ reset + disabled
        onResetFilters={resetFilters}
        resetDisabled={resetDisabled}
        summaryRows={filteredRows}
      />

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <LhpTable
                rows={filteredRows}
                buktiByLhp={buktiByRekom}
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
