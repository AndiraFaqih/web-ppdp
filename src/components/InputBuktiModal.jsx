import {
  Button,
  Label,
  Modal,
  TextInput,
  FileInput,
  Textarea,
  Checkbox,
} from "flowbite-react";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_STATUS = "Belum Tindak Lanjut";

export default function InputBuktiModal({
  isOpen,
  onClose,
  row,
  existing,
  onSubmit,
  onUpdateStatus, // ✅ callback dari AttendancePage
}) {
  const [tanggalUpload, setTanggalUpload] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [file, setFile] = useState(null);

  // ✅ status dipilih di modal, tapi belum di-commit sampai Simpan Bukti
  const [pickedStatus, setPickedStatus] = useState(DEFAULT_STATUS);

  // ✅ TAMBAHAN: catatan perpanjangan deadline (HANYA CATATAN)
  const [isPerpanjang, setIsPerpanjang] = useState(false);
  const [usulanBatasWaktu, setUsulanBatasWaktu] = useState("");
  const [catatanPerpanjangan, setCatatanPerpanjangan] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setTanggalUpload(existing?.tanggalUpload || "");
    setKeterangan(existing?.keterangan || "");
    setFile(null);

    // kalau row sudah punya statusLabel → jadikan default pilihan
    setPickedStatus(row?.statusLabel || DEFAULT_STATUS);

    // reset catatan perpanjangan setiap buka
    setIsPerpanjang(false);
    setUsulanBatasWaktu("");
    setCatatanPerpanjangan("");
  }, [isOpen, existing, row]);

  // ✅ dianggap "siap upload" kalau tanggal ada DAN file ada (baru atau existing)
  const isBuktiReady = useMemo(() => {
    const hasDate = Boolean(tanggalUpload);
    const hasFile = Boolean(file) || Boolean(existing?.fileUrl);
    return hasDate && hasFile;
  }, [tanggalUpload, file, existing]);

  const handleSubmit = () => {
    if (!row?.nomorLhp) return;

    // validasi minimal sesuai request: tanggal & bukti wajib
    if (!tanggalUpload) {
      alert("Tanggal upload bukti wajib diisi.");
      return;
    }
    if (!file && !existing?.fileUrl) {
      alert("File bukti wajib di-upload.");
      return;
    }

    // ✅ kalau Belum Sesuai + centang perpanjang → usulan tanggal wajib (catatan)
    if (pickedStatus === "Belum Sesuai" && isPerpanjang && !usulanBatasWaktu) {
      alert("Usulan batas waktu baru wajib diisi jika memilih perpanjangan deadline.");
      return;
    }

    // kalau user tidak pilih file baru, pakai file existing (kalau ada)
    let fileUrl = existing?.fileUrl || "";
    let fileName = existing?.fileName || "";
    let fileSize = existing?.fileSize || 0;

    if (file) {
      fileUrl = URL.createObjectURL(file);
      fileName = file.name;
      fileSize = file.size;
    }

    const payload = {
      tanggalUpload,
      keterangan,
      file, // ✅ Pass actual File object for backend upload
      fileUrl,
      fileName,
      fileSize,
      status: pickedStatus,
      perpanjangan:
        pickedStatus === "Belum Sesuai" && isPerpanjang
          ? {
              deadlineAwal: row?.batasWaktu || "",
              usulanBatasWaktu: usulanBatasWaktu || "",
              catatan: (catatanPerpanjangan || "").trim(),
            }
          : null,
    };

    // 1) simpan bukti dulu (including file upload to backend)
    onSubmit?.(payload);
  };

  return (
    <Modal onClose={onClose} show={isOpen} size="3xl">
      <Modal.Header className="border-b-2 border-gray-300 !p-4 dark:border-gray-600">
        <strong className="text-lg">📁 Input Bukti</strong>
      </Modal.Header>

      <Modal.Body className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {!row ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Data tidak tersedia.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Info LHP */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="nomorLhp">Nomor LHP</Label>
                <div className="mt-1">
                  <TextInput id="nomorLhp" value={row.nomorLhp || ""} readOnly />
                </div>
              </div>

              <div>
                <Label htmlFor="batasWaktu">Batas Waktu</Label>
                <div className="mt-1">
                  <TextInput id="batasWaktu" value={row.batasWaktu || ""} readOnly />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="temuan">Temuan</Label>
              <div className="mt-1">
                <Textarea id="temuan" value={row.temuan || ""} readOnly rows={2} className="border-2 border-gray-300 dark:border-gray-600" />
              </div>
            </div>

            <div>
              <Label htmlFor="rekomendasi">Rekomendasi</Label>
              <div className="mt-1">
                <Textarea
                  id="rekomendasi"
                  value={row.rekomendasi || ""}
                  readOnly
                  rows={2}
                  className="border-2 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>

            {/* Input bukti */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="tanggalUpload">Tanggal Upload Bukti</Label>
                <div className="mt-1">
                  <TextInput
                    id="tanggalUpload"
                    type="date"
                    value={tanggalUpload}
                    onChange={(e) => setTanggalUpload(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fileBukti">File Bukti</Label>
                <div className="mt-1">
                  <FileInput
                    id="fileBukti"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {existing?.fileName && !file && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      File saat ini: {existing.fileName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="keterangan">Keterangan (opsional)</Label>
              <div className="mt-1">
                <Textarea
                  id="keterangan"
                  rows={2}
                  placeholder="Catatan singkat..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="border-2 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>

            {/* ✅ pilihan status (disabled sebelum bukti siap) */}
            <div className="rounded-lg border-2 border-blue-300 p-4 dark:border-blue-600 bg-blue-50 dark:bg-gray-800 shadow-md">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                📊 Status Tindak Lanjut
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                * Tombol aktif setelah tanggal upload & file bukti terisi (atau sudah ada bukti sebelumnya).
                Status akan diperbarui saat klik <b>Simpan Bukti</b>.
              </p>

              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  color={pickedStatus === "Belum Sesuai" ? "failure" : "gray"}
                  disabled={!isBuktiReady}
                  onClick={() => setPickedStatus("Belum Sesuai")}
                >
                  Belum Sesuai
                </Button>

                <Button
                  type="button"
                  color={pickedStatus === "Sesuai" ? "success" : "gray"}
                  disabled={!isBuktiReady}
                  onClick={() => setPickedStatus("Sesuai")}
                >
                  Sesuai
                </Button>
              </div>

              {/* ✅ TAMBAHAN: opsi perpanjang deadline (CATATAN SAJA) */}
              {pickedStatus === "Belum Sesuai" && (
                <div className="mt-4 rounded-lg border border-gray-300 p-4 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="perpanjang"
                      checked={isPerpanjang}
                      disabled={!isBuktiReady}
                      onChange={(e) => setIsPerpanjang(e.target.checked)}
                    />
                    <Label htmlFor="perpanjang">
                      Sertakan catatan perpanjangan deadline (tidak mengubah deadline awal)
                    </Label>
                  </div>

                  {isPerpanjang && (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Deadline Awal</Label>
                        <div className="mt-1">
                          <TextInput value={row?.batasWaktu || ""} readOnly className="border-2 border-gray-300 dark:border-gray-600" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="usulanBatasWaktu">
                          Usulan Batas Waktu Baru (Catatan)
                        </Label>
                        <div className="mt-1">
                          <TextInput
                            id="usulanBatasWaktu"
                            type="date"
                            value={usulanBatasWaktu}
                            onChange={(e) => setUsulanBatasWaktu(e.target.value)}
                            disabled={!isBuktiReady}
                            className="border-2 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="catatanPerpanjangan">Catatan</Label>
                        <div className="mt-1">
                          <Textarea
                            id="catatanPerpanjangan"
                            rows={2}
                            placeholder="Contoh: butuh tambahan waktu untuk pemenuhan dokumen pendukung..."
                            value={catatanPerpanjangan}
                            onChange={(e) => setCatatanPerpanjangan(e.target.value)}
                            disabled={!isBuktiReady}
                            className="border-2 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          * Ini hanya catatan (record) dan tidak mengubah deadline asli di tabel.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-t-2 border-gray-300 dark:border-gray-600">
        <Button color="primary" onClick={handleSubmit} disabled={!row}>
          💾 Simpan Bukti
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
