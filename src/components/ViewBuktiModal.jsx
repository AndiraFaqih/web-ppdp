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
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Riwayat Bukti</strong>
      </Modal.Header>

      <Modal.Body>
        {!row ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Data tidak tersedia.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200">
              <div>
                <span className="font-semibold">Nomor LHP:</span> {row.nomorLhp}
              </div>
              <div className="mt-1">
                <span className="font-semibold">Batas Waktu:</span>{" "}
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
                <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
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
                          className={`w-full border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50
                                      dark:border-gray-700 dark:hover:bg-gray-700 ${
                                        active ? "bg-gray-50 dark:bg-gray-700" : ""
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

                  <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                    <Button
                      color="failure"
                      size="xs"
                      onClick={() => onDeleteAll?.(nomorLhp)}
                    >
                      Hapus Semua
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      * Hapus semua bukti untuk LHP ini
                    </p>
                  </div>
                </div>

                {/* DETAIL SELECTED */}
                <div className="lg:col-span-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
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
                    <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Catatan Perpanjangan Deadline (Tidak mengubah deadline asli)
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
                    <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Keterangan
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
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
