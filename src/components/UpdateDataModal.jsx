import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";

const uid = () =>
  (crypto?.randomUUID?.() ? crypto.randomUUID() : String(Date.now() + Math.random()));

export default function UpdateDataModal({
  isOpen,
  onClose,
  rows = [],
  onAddRow,
  onUpdateRowDate,
}) {
  const [nomorLhp, setNomorLhp] = useState("");

  // TEMUAN
  const [temuanPick, setTemuanPick] = useState(""); // existing temuan atau "__new__"
  const [temuanBaru, setTemuanBaru] = useState("");

  // REKOMENDASI
  const [rekomPick, setRekomPick] = useState(""); // existing rekom rowKey atau "__new__"
  const [rekomBaru, setRekomBaru] = useState("");

  // DATE
  const [batasWaktu, setBatasWaktu] = useState("");

  const nomorOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.nomorLhp))).filter(Boolean),
    [rows]
  );

  const rowsByLhp = useMemo(
    () => rows.filter((r) => r.nomorLhp === nomorLhp),
    [rows, nomorLhp]
  );

  const temuanOptions = useMemo(
    () => Array.from(new Set(rowsByLhp.map((r) => r.temuan))).filter(Boolean),
    [rowsByLhp]
  );

  const basePic = rowsByLhp[0]?.picNama || "";
  const baseEmail = rowsByLhp[0]?.picEmail || "";

  const rowsByTemuan = useMemo(() => {
    const finalTemuan = temuanPick === "__new__" ? temuanBaru.trim() : temuanPick;
    if (!finalTemuan) return [];
    return rowsByLhp.filter((r) => r.temuan === finalTemuan);
  }, [rowsByLhp, temuanPick, temuanBaru]);

  // opsi rekomendasi = rekomendasi existing (per row) supaya bisa update tanggal spesifik
  const rekomOptions = useMemo(() => {
    // pakai row.id sebagai key (harus ada)
    return rowsByTemuan
      .filter((r) => r.rekomendasi)
      .map((r) => ({
        key: r.id,
        label:
          (r.rekomendasi.length > 90 ? r.rekomendasi.slice(0, 90) + "..." : r.rekomendasi) +
          (r.batasWaktu ? ` (batas: ${r.batasWaktu})` : ""),
        row: r,
      }));
  }, [rowsByTemuan]);

  useEffect(() => {
    if (isOpen) {
      setNomorLhp("");
      setTemuanPick("");
      setTemuanBaru("");
      setRekomPick("");
      setRekomBaru("");
      setBatasWaktu("");
    }
  }, [isOpen]);

  // saat pilih nomorLhp → set temuan default
  useEffect(() => {
    if (!nomorLhp) return;
    if (rowsByLhp.length === 0) return;

    if (temuanOptions.length > 0) setTemuanPick(temuanOptions[0]);
    else setTemuanPick("__new__");

    setTemuanBaru("");
    setRekomPick("");
    setRekomBaru("");
    setBatasWaktu("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nomorLhp]);

  // saat pilih temuan → set rekom default
  useEffect(() => {
    if (!nomorLhp || rowsByLhp.length === 0) return;

    // kalau temuan baru → otomatis mode rekom baru
    if (temuanPick === "__new__") {
      setRekomPick("__new__");
      setRekomBaru("");
      setBatasWaktu("");
      return;
    }

    // kalau temuan existing → set rekom default ke pertama kalau ada
    if (rekomOptions.length > 0) {
      setRekomPick(rekomOptions[0].key);
      setBatasWaktu(rekomOptions[0].row?.batasWaktu || "");
      setRekomBaru("");
    } else {
      setRekomPick("__new__");
      setRekomBaru("");
      setBatasWaktu("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temuanPick, temuanBaru]);

  // saat pilih rekom existing → isi batas waktu dari row tersebut
  useEffect(() => {
    if (!rekomPick || rekomPick === "__new__") return;
    const found = rekomOptions.find((o) => o.key === rekomPick);
    if (found) {
      setBatasWaktu(found.row?.batasWaktu || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rekomPick]);

  const handleSubmit = () => {
    // wajib existing LHP
    if (!nomorLhp || rowsByLhp.length === 0) return;

    const finalTemuan = temuanPick === "__new__" ? temuanBaru.trim() : temuanPick;
    if (!finalTemuan) return;

    // case 1: update tanggal rekomendasi existing
    if (rekomPick && rekomPick !== "__new__") {
      if (!batasWaktu) return;
      onUpdateRowDate?.(rekomPick, batasWaktu);
      onClose();
      return;
    }

    // case 2: tambah rekomendasi baru
    if (!rekomBaru.trim()) return;
    if (!batasWaktu) return;

    const newRow = {
      id: uid(),
      nomorLhp,
      temuan: finalTemuan,
      rekomendasi: rekomBaru.trim(),
      batasWaktu, // YYYY-MM-DD
      statusLabel: "Belum Tindak Lanjut",
      statusDot: "bg-green-400",
      picNama: basePic,
      picEmail: baseEmail,
    };

    onAddRow?.(newRow);
    onClose();
  };

  const lhpNotFound = nomorLhp && rowsByLhp.length === 0;

  return (
    <Modal onClose={onClose} show={isOpen} size="lg">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Update Data LHP</strong>
      </Modal.Header>

      <Modal.Body>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Nomor LHP */}
          <div className="sm:col-span-2">
            <Label htmlFor="upd-nomor">Nomor LHP (pilih yang sudah ada)</Label>
            <div className="mt-1">
              <TextInput
                id="upd-nomor"
                list="lhp-list"
                value={nomorLhp}
                onChange={(e) => setNomorLhp(e.target.value)}
                placeholder="Ketik / pilih nomor LHP..."
              />
              <datalist id="lhp-list">
                {nomorOptions.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>

            {lhpNotFound && (
              <p className="mt-2 text-sm text-red-600">
                Nomor LHP tidak ditemukan. Update hanya untuk LHP yang sudah ada.
              </p>
            )}
          </div>

          {/* PIC read-only */}
          <div>
            <Label htmlFor="upd-pic">PIC</Label>
            <div className="mt-1">
              <TextInput id="upd-pic" value={basePic} readOnly />
            </div>
          </div>

          <div>
            <Label htmlFor="upd-email">Email PIC</Label>
            <div className="mt-1">
              <TextInput id="upd-email" value={baseEmail} readOnly />
            </div>
          </div>

          {/* Temuan */}
          <div className="sm:col-span-2">
            <Label htmlFor="upd-temuan">Temuan</Label>
            <div className="mt-1">
              <select
                id="upd-temuan"
                value={temuanPick}
                onChange={(e) => setTemuanPick(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900
                           dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                disabled={!nomorLhp || rowsByLhp.length === 0}
              >
                {temuanOptions.map((t) => (
                  <option key={t} value={t}>
                    {t.length > 80 ? t.slice(0, 80) + "..." : t}
                  </option>
                ))}
                <option value="__new__">+ Temuan baru</option>
              </select>
            </div>

            {temuanPick === "__new__" && (
              <div className="mt-3">
                <Label htmlFor="upd-temuan-baru">Isi Temuan Baru</Label>
                <textarea
                  id="upd-temuan-baru"
                  rows={4}
                  value={temuanBaru}
                  onChange={(e) => setTemuanBaru(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900
                             dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Tulis temuan baru..."
                />
              </div>
            )}
          </div>

          {/* Rekomendasi (dropdown + opsi rekom baru) */}
          <div className="sm:col-span-2">
            <Label htmlFor="upd-rekom-select">Rekomendasi</Label>
            <div className="mt-1">
              <select
                id="upd-rekom-select"
                value={rekomPick}
                onChange={(e) => setRekomPick(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900
                           dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                disabled={!nomorLhp || rowsByLhp.length === 0}
              >
                {rekomOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
                <option value="__new__">+ Rekomendasi baru</option>
              </select>
            </div>

            {/* kalau pilih rekom baru, tampil textarea input */}
            {rekomPick === "__new__" && (
              <div className="mt-3">
                <Label htmlFor="upd-rekom-baru">Isi Rekomendasi Baru</Label>
                <textarea
                  id="upd-rekom-baru"
                  rows={4}
                  value={rekomBaru}
                  onChange={(e) => setRekomBaru(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900
                             dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Tulis rekomendasi..."
                  disabled={!nomorLhp || rowsByLhp.length === 0}
                />
              </div>
            )}
          </div>

          {/* Batas Waktu (dipakai untuk update tanggal atau rekom baru) */}
          <div className="sm:col-span-2 sm:max-w-xs">
            <Label htmlFor="upd-batas">Batas Waktu</Label>
            <div className="mt-1">
              <TextInput
                id="upd-batas"
                type="date"
                value={batasWaktu}
                onChange={(e) => setBatasWaktu(e.target.value)}
                disabled={!nomorLhp || rowsByLhp.length === 0}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Kalau pilih rekomendasi yang sudah ada, cukup ubah tanggal lalu simpan.
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={!nomorLhp || rowsByLhp.length === 0}
        >
          Simpan Update
        </Button>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
