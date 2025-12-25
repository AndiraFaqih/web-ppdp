import { Button, Modal } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";

export default function ViewBuktiModal({
  isOpen,
  onClose,
  row,
  buktiList = [],
  onDeleteOne,
  onDeleteAll,
  formatTanggal,
  onApprovalAction,
}) {
  const [selectedId, setSelectedId] = useState(null);

  const sorted = useMemo(() => {
    const list = Array.isArray(buktiList) ? buktiList : [];
    // newest sudah di index 0 (dari AttendancePage), tapi kita tetap amankan sorting
    return [...list].sort((a, b) => {
      const da = new Date(a?.createdAt || 0).getTime();
      const db = new Date(b?.createdAt || 0).getTime();
      return db - da;
    });
  }, [buktiList]);

  const selected = useMemo(
    () => sorted.find((b) => b.id === selectedId) || sorted[0] || null,
    [sorted, selectedId]
  );

  useEffect(() => {
    if (!isOpen) return;
    setSelectedId(sorted[0]?.id || null);
  }, [isOpen, sorted]);

  const nomorLhp = row?.nomorLhp;

  const fmt = (d) => {
    if (!d) return "-";
    return formatTanggal ? formatTanggal(d) : d;
  };

  return (
    <Modal onClose={onClose} show={isOpen} size="5xl">
      <Modal.Header className="border-b-2 border-gray-300 !p-4 dark:border-gray-600">
        <strong className="text-lg"> Riwayat Bukti</strong>
      </Modal.Header>

      <Modal.Body className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {!row ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Data tidak tersedia.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-blue-300 p-4 text-sm text-gray-700 shadow-md dark:border-blue-600 dark:text-gray-200 bg-blue-50 dark:bg-gray-800">
              <div>
                <span className="font-semibold"> Nomor LHP:</span> {row.nomorLhp}
              </div>
              <div className="mt-1">
                <span className="font-semibold"> Batas Waktu:</span>{" "}
                {row.batasWaktu || "-"}
              </div>
            </div>

            {sorted.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Belum ada bukti yang di-upload untuk LHP ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* LIST HISTORY */}
                <div className="rounded-lg border-2 border-gray-300 shadow-lg dark:border-gray-600">
                  <div className="border-b-2 border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 dark:border-gray-600 dark:text-white bg-gray-50 dark:bg-gray-700">
                     Daftar Upload ({sorted.length})
                  </div>

                  <div className="max-h-[420px] overflow-auto">
                    {sorted.map((b, idx) => {
                      const active = b.id === selected?.id;
                      const statusText = b?.status || "-";
                      const hasPerpanjangan = Boolean(b?.perpanjangan);

                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedId(b.id)}
                          className={`w-full border-b-2 border-gray-200 px-4 py-3 text-left hover:bg-blue-50
                                      dark:border-gray-600 dark:hover:bg-gray-700 transition-colors ${
                                        active ? "bg-blue-100 dark:bg-gray-700 border-l-4 border-l-blue-500" : ""
                                      }`}
                        >
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            Upload #{sorted.length - idx}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                            Tanggal:{" "}
                            <span className="font-medium">{fmt(b.tanggalUpload)}</span>
                          </div>
                          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {b.fileName || "—"}
                          </div>

                          {/* ✅ TAMBAHAN: status + indikator perpanjangan */}
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                            Status: <span className="font-medium">{statusText}</span>
                            {hasPerpanjangan ? (
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                • Ada catatan perpanjangan
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t-2 border-gray-300 px-4 py-3 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => onDeleteAll?.(nomorLhp)}
                    >
                       Hapus Semua
                    </Button>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      * Hapus semua bukti untuk LHP ini
                    </p>
                  </div>
                </div>

                {/* DETAIL SELECTED */}
                <div className="lg:col-span-2 rounded-lg border-2 border-gray-300 p-4 shadow-lg dark:border-gray-600">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                         Detail Bukti
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                        Tanggal Upload:{" "}
                        <span className="font-medium">{fmt(selected?.tanggalUpload)}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                        File:{" "}
                        <span className="font-medium">{selected?.fileName || "-"}</span>
                      </div>

                      {/* ✅ TAMBAHAN: status */}
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                        Status:{" "}
                        <span className="font-medium">{selected?.status || "-"}</span>
                      </div>
                    </div>

                    <Button
                      color="failure"
                      size="xs"
                      onClick={() => onDeleteOne?.(nomorLhp, selected?.id)}
                      disabled={!selected?.id}
                    >
                      Hapus Bukti Ini
                    </Button>
                  </div>

                  {/* ✅ TAMBAHAN: catatan perpanjangan deadline (jika ada) */}
                  {selected?.perpanjangan && (
                    <div className="mt-4 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-3 text-sm text-gray-700 shadow-md dark:border-yellow-600 dark:bg-gray-800 dark:text-gray-200">
                      <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                        ⏳ Catatan Perpanjangan Deadline (Tidak mengubah deadline asli)
                      </div>

                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="text-xs">
                          <span className="font-semibold">Deadline Awal:</span>{" "}
                          {selected.perpanjangan.deadlineAwal || row?.batasWaktu || "-"}
                        </div>
                        <div className="text-xs">
                          <span className="font-semibold">Usulan Batas Waktu Baru:</span>{" "}
                          {fmt(selected.perpanjangan.usulanBatasWaktu)}
                        </div>
                      </div>

                      {selected.perpanjangan.catatan && (
                        <div className="mt-2 text-xs whitespace-pre-wrap">
                          <span className="font-semibold">Catatan:</span>{" "}
                          {selected.perpanjangan.catatan}
                        </div>
                      )}
                    </div>
                  )}

                  {selected?.keterangan && (
                    <div className="mt-4 rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        💬 Keterangan
                      </div>
                      <div className="mt-1 whitespace-pre-wrap">{selected.keterangan}</div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={selected?.fileUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                        selected?.fileUrl
                          ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                          : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        if (!selected?.fileUrl) e.preventDefault();
                      }}
                    >
                      Lihat File
                    </a>

                    <a
                      href={selected?.fileUrl || "#"}
                      download={selected?.fileName || "bukti"}
                      className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                        selected?.fileUrl
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        if (!selected?.fileUrl) e.preventDefault();
                      }}
                    >
                      Download
                    </a>
                    {/* ✅ APPROVAL BERJENJANG */}
                    <div className="mt-6 rounded-lg border-2 border-green-300 p-4 shadow-md dark:border-green-600 bg-green-50 dark:bg-gray-800">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                             Approval Berjenjang
                          </div>

                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                            Status:
                            <span className="ml-1 font-medium">
                              {selected?.approval?.state || "PENDING_1"}
                            </span>
                          </div>

                          {selected?.approval?.state === "REJECTED" && (
                            <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                              Bukti ditolak. Silakan upload ulang bukti terbaru.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Riwayat approval */}
                      <div className="mt-3 space-y-2">
                        {(selected?.approval?.history || []).length === 0 ? (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Belum ada aksi approval.
                          </div>
                        ) : (
                          (selected?.approval?.history || []).slice(0, 5).map((h, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-gray-300 bg-white p-3 text-xs text-gray-700 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            >
                              <div className="font-semibold">
                                {h.action === "APPROVE" ? "✅ Disetujui" : "❌ Ditolak"}{" "}
                                <span className="font-normal text-gray-500 dark:text-gray-400">
                                  ({h.byName || h.byEmail || "Approver"} • {fmt(h.at)})
                                </span>
                              </div>
                              {h.note && <div className="mt-1 whitespace-pre-wrap">Catatan: {h.note}</div>}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Tombol approve/reject (sementara tampilkan untuk semua; kalau mau role-based tinggal guard) */}
                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <Button
                          color="success"
                          onClick={() =>
                            onApprovalAction?.(nomorLhp, selected?.id, "APPROVE", {
                              byName: "Atasan",
                              byEmail: "",
                            })
                          }
                          disabled={!selected?.id || selected?.approval?.state === "APPROVED"}
                        >
                          Approve
                        </Button>

                        <Button
                          color="failure"
                          onClick={() => {
                            const note = prompt("Catatan penolakan (wajib):");
                            if (!note) return;
                            onApprovalAction?.(nomorLhp, selected?.id, "REJECT", {
                              note,
                              byName: "Atasan",
                              byEmail: "",
                            });
                          }}
                          disabled={!selected?.id || selected?.approval?.state === "APPROVED"}
                        >
                          Reject
                        </Button>
                      </div>

                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        * Jika ditolak, PIC upload bukti ulang → otomatis akan jadi versi terbaru di riwayat.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-t-2 border-gray-300 dark:border-gray-600">
        <Button color="gray" onClick={onClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
