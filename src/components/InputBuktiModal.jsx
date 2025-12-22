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
      fileUrl,
      fileName,
      fileSize,
      status: pickedStatus,
      
      // ✅ simpan status & catatan perpanjangan ke HISTORY (biar kebaca di "Lihat bukti")
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

    // 1) simpan bukti dulu
    onSubmit?.(payload);

    // 2) ✅ baru update status (aturan: tidak boleh sebelum upload)
    if (row?.id && isBuktiReady) {
      onUpdateStatus?.(row.id, pickedStatus);
    }
  };

  return (
    <Modal onClose={onClose} show={isOpen} size="3xl">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Input Bukti</strong>
      </Modal.Header>

      <Modal.Body>
        {!row ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Data tidak tersedia.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Info LHP */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                <Textarea id="temuan" value={row.temuan || ""} readOnly rows={4} />
              </div>
            </div>

            <div>
              <Label htmlFor="rekomendasi">Rekomendasi</Label>
              <div className="mt-1">
                <Textarea
                  id="rekomendasi"
                  value={row.rekomendasi || ""}
                  readOnly
                  rows={3}
                />
              </div>
            </div>

            {/* Input bukti */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                />
              </div>
            </div>

            {/* ✅ pilihan status (disabled sebelum bukti siap) */}
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Status Tindak Lanjut
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
                <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
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
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label>Deadline Awal</Label>
                        <div className="mt-1">
                          <TextInput value={row?.batasWaktu || ""} readOnly />
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
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="catatanPerpanjangan">Catatan</Label>
                        <div className="mt-1">
                          <Textarea
                            id="catatanPerpanjangan"
                            rows={3}
                            placeholder="Contoh: butuh tambahan waktu untuk pemenuhan dokumen pendukung..."
                            value={catatanPerpanjangan}
                            onChange={(e) => setCatatanPerpanjangan(e.target.value)}
                            disabled={!isBuktiReady}
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

      <Modal.Footer>
        <Button color="primary" onClick={handleSubmit} disabled={!row}>
          Simpan Bukti
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
